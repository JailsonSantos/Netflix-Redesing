import Head from 'next/head';
import payments from '@/lib/stipe';
import Row from '@/components/Row';
import useAuth from '@/hooks/useAuth';
import Modal from '@/components/Modal';
import Plans from '@/components/Plans';
import requests from '@/utils/requests';
import { useRecoilValue } from 'recoil';
import Header from '@/components/Header';
import Banner from '@/components/Banner';
import { Movie } from '@/@types/typings';
import { modalState } from '@/atoms/modalAtom';
import { getProducts, Product } from '@stripe/firestore-stripe-payments';

interface HomeProps {
  netflixOriginals: Movie[];
  trendingNow: Movie[];
  topRated: Movie[];
  actionMovies: Movie[];
  comedyMovies: Movie[];
  horrorMovies: Movie[];
  romanceMovies: Movie[];
  documentaries: Movie[];
  products: Product[];
}

export default function Home({
  netflixOriginals,
  trendingNow,
  topRated,
  actionMovies,
  comedyMovies,
  horrorMovies,
  romanceMovies,
  documentaries,
  products
}: HomeProps) {

  console.log('products: =>', products)

  const { loading } = useAuth();
  const showModal = useRecoilValue(modalState);
  const subscription = false;

  if (loading || subscription === null) return null;

  if (!subscription) return <Plans products={products} />

  return (
    <div className={`relative h-screen bg-gradient-to-b lg:h-[140vh] 
    ${showModal && '!h-screen overflow-hidden'}`}
    >
      <Head>
        <title>Home - Netflix</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className='relative pl-4 pb-24 lg:space-7-24 lg:pl-16'>

        <Banner netflixOriginals={netflixOriginals} />

        <section className='md:space-y-24'>
          <Row title="Trending Now" movies={trendingNow} />
          <Row title="Top Rated" movies={topRated} />
          <Row title="Action Thrillers" movies={actionMovies} />


          {/* My List components favorites */}
          {/* {list.length && <Row title="My List" movies={list}/>} */}

          <Row title="Comedies" movies={comedyMovies} />
          <Row title="Scary Movies" movies={horrorMovies} />
          <Row title="Romance Movies" movies={romanceMovies} />
          <Row title="Documentaries" movies={documentaries} />
        </section>
      </main>

      {showModal && <Modal />}

    </div>
  )
}

export const getServerSideProps = async () => {

  const products = await getProducts(payments, {
    includePrices: true,
    activeOnly: true,
  })
    .then((response) => response)
    .catch((err) => console.log(err.message)
    );

  const [
    netflixOriginals,
    trendingNow,
    topRated,
    actionMovies,
    comedyMovies,
    horrorMovies,
    romanceMovies,
    documentaries,
  ] = await Promise.all([
    fetch(requests.fetchNetflixOriginals).then(response => response.json()),
    fetch(requests.fetchTrending).then(response => response.json()),
    fetch(requests.fetchTopRated).then(response => response.json()),
    fetch(requests.fetchActionMovies).then(response => response.json()),
    fetch(requests.fetchComedyMovies).then(response => response.json()),
    fetch(requests.fetchHorrorMovies).then(response => response.json()),
    fetch(requests.fetchRomanceMovies).then(response => response.json()),
    fetch(requests.fetchDocumentaries).then(response => response.json()),
  ]);

  return {
    props: {
      netflixOriginals: netflixOriginals.results,
      trendingNow: trendingNow.results,
      topRated: topRated.results,
      actionMovies: actionMovies.results,
      comedyMovies: comedyMovies.results,
      horrorMovies: horrorMovies.results,
      romanceMovies: romanceMovies.results,
      documentaries: documentaries.results,
      products,
    }
  }
}