import Head from "next/head";
import Nav from "../components/Nav";
import Info from "../components/FAQ";
import Footer from "../components/Footer";
import Alert from "../components/AlertFaux";
import { NextSeo } from "next-seo";
import React from "react";
import ReactDOM from "react-dom";

export default function FAQ() {
  return (
    <div className="text-black">
      <NextSeo
        title="Generator illoMX"
        description="TAO NFT Marketplace illoMX"
        canonical="https://illo.mx/generator"
      />
      <Head>
        <title>illoMX FAQ</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <Alert />
      <Info />
      <Footer />
    </div>
  );
}
