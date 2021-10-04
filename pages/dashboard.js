import Head from "next/head";

import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Dash from "../components/Dashboard/Dashboard";
import Items from "../components/Dashboard/DashboardItems";

import Alert from "../components/AlertFaux";
import { NextSeo } from "next-seo";
import React from "react";
import ReactDOM from "react-dom";

export default function Dashboard() {
  return (
    <div className="text-black">
      <NextSeo
        title="Dashboard illoMX"
        description="TAO NFT Marketplace illoMX"
        canonical="https://illo.mx/dashboard"
      />
      <Head>
        <title>illoMX Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />

      <Dash />
      <Items />
      <Footer />
    </div>
  );
}
