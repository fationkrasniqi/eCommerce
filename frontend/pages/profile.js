import { useRouter } from "next/router";
const stripe = require('stripe')(`${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY}`);
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0/client";
import styled from "styled-components";

export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(ctx){
       const session = getSession(ctx.req, ctx.res);
       const stripeId = session.user['${process.env.BASE_URL}/stripe_customer_id'];
       const paymentIntents = await stripe.paymentIntents.list({
       customer: stripeId,
       });
       return {props: {orders: paymentIntents.data}};
    },
});


export default function Profile({user, orders}){
    const route = useRouter();
    return(
        user && (
            <div>
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <div>
                    {orders.map((order) => (
                        <Order>
                            <h1>Order number: {order.id}</h1>
                            <h2>{order.amount}</h2>
                            <h2>Receipt Email: {user.email}</h2>
                        </Order>

                    ))}
                </div>
                <button onClick={() => route.push('/api/auth/logout')}>Logout</button>
            </div>
        )
    )
}


const Order = styled.div`
background: white;
margin: 2rem 0rem;
padding: 3rem;
display: flex;
justify-content: space-between;
`