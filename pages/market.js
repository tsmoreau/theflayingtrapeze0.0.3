import Head from "next/head";
import Nav from "../components/Nav";
import Marketplace from "../components/Market";
import Items from "../components/MarketItems";
import Footer from "../components/Footer";
import Alert from "../components/AlertFaux";
import { NextSeo } from "next-seo";
import React from "react";
import ReactDOM from "react-dom";

export default function Market() {
  return (
    <div className="text-black">
      <NextSeo
        title="Market illoMX"
        description="TAO NFT Marketplace illoMX"
        canonical="https://illo.mx/market"
      />
      <Head>
        <title>illoMX Marketplace</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav />

      <Marketplace />
      <Items />
      <Footer />
    </div>
  );
}
