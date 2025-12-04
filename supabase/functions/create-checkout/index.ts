import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: {
        headers: {
          Authorization: req.headers.get("Authorization") ?? "",
        },
      },
    }
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) {
      throw new Error("User not authenticated");
    }

    const { items } = await req.json();

    if (!items || items.length === 0) {
      throw new Error("No items in cart");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create line items
    const lineItems = items.map((item: any) => {
      const price = item.product.price + (item.variant?.price_modifier || 0);
      // Only send absolute HTTP(S) image URLs to Stripe, otherwise omit images
      const firstImage = Array.isArray(item.product.images) ? item.product.images[0] : undefined;
      const imageUrl = typeof firstImage === 'string' && /^https?:\/\//i.test(firstImage) ? firstImage : undefined;

      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.product.name,
            description: item.variant ? `${item.variant.color || ''} ${item.variant.size || ''}`.trim() : undefined,
            images: imageUrl ? [imageUrl] : undefined,
          },
          unit_amount: Math.round(price * 100), // Convert to cents
        },
        quantity: item.quantity,
      };
    });

    // Create order record
    const orderNumber = `ORD-${Date.now()}`;
    const totalAmount = items.reduce((sum: number, item: any) => {
      const price = item.product.price + (item.variant?.price_modifier || 0);
      return sum + (price * item.quantity);
    }, 0);

    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        customer_id: user.id,
        order_number: orderNumber,
        total_amount: totalAmount,
        status: 'pending',
        shipping_address: 'À définir',
        shipping_city: 'À définir',
        shipping_country: 'À définir',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      throw new Error('Failed to create order');
    }

    // Create order items
    for (const item of items) {
      const price = item.product.price + (item.variant?.price_modifier || 0);
      await supabaseClient.from('order_items').insert({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: price,
        total_price: price * item.quantity,
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/cart`,
      metadata: {
        order_id: order.id,
        order_number: orderNumber,
      },
    });

    return new Response(
      JSON.stringify({ url: session.url, orderId: order.id }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error('Checkout error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
