import { useQuery } from "urql";
import { GET_PRODUCT_QUERY } from "../../lib/query";
import {useRouter} from 'next/router';
import { DetailsStyle } from "../../styles/ProductDetails";
import { DetailInfo } from "../../styles/ProductDetails";
import { Quantity } from "../../styles/ProductDetails";
import { Buy } from "../../styles/ProductDetails";
import {AiFillPlusCircle, AiFillMinusCircle} from 'react-icons/ai';
import { useStateContext } from "../../lib/context";
import toast from 'react-hot-toast';
import { useEffect } from "react";


export default  function ProductDetails(){
      //UseState
    const {qty, increaseQty, decreaseQty,cartItems, onAdd, setQty} = useStateContext();

    //Reset Qty

    useEffect(()=> {
        setQty(1);
    },[])

    //Fetch Slug
    const {query} = useRouter();
     //Fetch Graphql data
    const [results] = useQuery({
        query: GET_PRODUCT_QUERY,
        variables: {slug: query.slug},
    });

   const {data,fetching,error} = results;
   if(fetching) return <p>Loading</p>
   if(error) return <p>Oh noooo  {error.message}</p>

   const {title,description,image} = data.products.data[0].attributes;

       //Create a toast

       const notify = () => {
        toast.success("Product added to your cart", {duration: 1500});
       }

    return(
       <DetailsStyle>
        <img src={image.data.attributes.formats.small.url} alt={title}/>
        <DetailInfo>
            <h3>{title}</h3>
            <p>{description}</p>
       
        <Quantity>
        <span>Quantity</span>
        <button onClick={decreaseQty}><AiFillMinusCircle/></button>
        <p>{qty}</p>
        <button onClick={increaseQty}><AiFillPlusCircle/></button>
         </Quantity>
       <Buy onClick={()=> { onAdd(data.products.data[0].attributes, qty )
        notify();
    }}>Add to Cart</Buy>
       </DetailInfo>
     
       </DetailsStyle>
        
    );
}