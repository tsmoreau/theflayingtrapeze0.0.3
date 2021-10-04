import Head from "next/head";
import Nav from "../components/Nav";
import Info from "../components/Admin";
import Footer from "../components/Footer";
import Alert from "../components/AlertFaux";
import { NextSeo } from "next-seo";
import React from "react";
import ReactDOM from "react-dom";

export default function FAQ() {
  return (
    <div className="text-black">
      <NextSeo
        title="admin illoMX"
        description="TAO NFT Marketplace illoMX"
        canonical="https://illo.mx/admin"
      />
      <Head>
        <title>illoMX Admin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <Info />
      <Footer />
    </div>
  );
}
