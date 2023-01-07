import Stripe from "stripe";

const stripe = new Stripe(`${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY}`);

export default async function handler(req,res) {
    if(req.method === "POST"){
           try{
                 const session = await stripe.checkout.sessions.create({
                    submit_type: 'pay',
                    mode: 'payment',
                    // customer: stripeId,
                    payment_method_types: ['card'],
                    shipping_address_collection: {
                            allowed_countries: ['AR', 'AU', 'AT', 'BE', 'BO', 'BR', 'BG', 'CA', 'CL', 'CO', 'CR', 'HR', 'CY',
                             'CZ', 'DK', 'DO', 'EG', 'EE', 'FI', 'FR', 'DE', 'GR', 'HK', 'HU', 'IS', 'IN', 'ID', 'IE', 'IL', 
                             'IT', 'JP', 'LV', 'LI', 'LT', 'LU', 'MT', 'MX', 'NL', 'NZ', 'NO', 'PY', 'PE', 'PL', 'PT', 'RO',
                              'SG', 'SK', 'SI', 'ES', 'SE', 'CH', 'TH', 'TT', 'AE', 'GB', 'US', 'UY']
                    },
                      allow_promotion_codes: true,
                      shipping_options: [{
                        shipping_rate:  "shr_1LmgLEKdOomzLVv8zIzSf8ol"
                      },  {shipping_rate: "shr_1LmgeqKdOomzLVv8pX2rdubd"}],

                         line_items: req.body.map(item => {
                            return{
                                price_data: {
                                    currency: 'usd',
                                    product_data: {
                                        name: item.title,
                                        images: [item.image.data.attributes.formats.thumbnail.url],
                                    },
                                    unit_amount: item.price * 100,

                                },
                                adjustable_quantity: {
                                    enabled: true,
                                    minimum: 1
                                },
                                quantity: item.quantity,
                            };
                         }),
                         //Bring people to  the success or failed page
                         success_url: `${req.headers.origin}/success?&session_id={CHECKOUT_SESSION_ID}`,
                         cancel_url: `${req.headers.origin}/canceled`,
                 });
                 res.status(200).json(session);
           } catch (error){
                  res.status(error.statusCode || 500).json(error.message);
           }
     }
}