import Head from 'next/head';
import { useQuery } from 'urql';
import {PRODUCT_QUERY} from '../lib/query';
import Product from '../components/Products';
import {Gallery} from '../styles/Gallery';


export default function Home() {

  const [results] = useQuery({query: PRODUCT_QUERY});
  const {data, fetching, error} = results;

  if(fetching) return <p>Loading</p>
  if(error) return <p>Oh noooo  {error.message}</p>
  const products = data.products.data
  console.log(data)
  return (
    <div >
      <Head>
        <title>Online shop</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main >
        <Gallery>
        {products.map((product) => (
                 <Product key={product.attributes.slug} product={product}/>        


        ))}
          </Gallery>
        </main>
    </div>
  )
}
