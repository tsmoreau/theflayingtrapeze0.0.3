import Head from "next/head";
import Landing from "../components/Landing";
import Footer from "../components/Footer";
import Alert from "../components/AlertFaux";
import { NextSeo } from "next-seo";

import useEagerConnect from "../hooks/useEagerConnect";

export default function Home2() {
  const triedToEagerConnect = useEagerConnect();

  return (
    <div className="text-black w-full h-full min-h-screen">
      <NextSeo
        title="illoMX"
        description="illoMX NFT Marketplace"
        canonical="https://illo.mx/"
      />
      <Head>
        <title>illoMX</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Alert />
      <Landing />
      <Footer />
      <div class="wave"></div>
      <div class="wave2"></div>
    </div>
  );
}
