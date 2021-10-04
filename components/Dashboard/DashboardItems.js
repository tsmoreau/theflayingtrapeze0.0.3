/* pages/creator-dashboard.js */
import { ethers } from "ethers";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import Create from "../ModalCreateBox";
import { nftmarketaddress, nftaddress } from "../../config";

import ItemsOwned from "./DashboardItemsOwned";
import ItemsCreated from "./DashboardItemsCreated";

import Tabs from "./DashboardSelector";

import Market from "../../abis/NFTMarket.json";
import NFT from "../../abis/NFT.json";

import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

const people = [
  { name: "items created" },
  { name: "items owned" },
  { name: "items on sale" },
  { name: "items not on sale" }
];

export default function CreatorDashboard() {
  const [selected, setSelected] = useState(people[0]);
  const [nfts, setNfts] = useState([]);
  const [mynfts, setMyNfts] = useState([]);
  const [sold, setSold] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {}

  return (
    <div className="pl-4">
      <div>
        <div class="max-w-6xl mx-auto  px-4 pt-4 flex  items-center bg-white">
          <div class="max-w-6xl mx-auto  px-4 pt-4 flex  items-center bg-white">
            <Tabs />
          </div>

          <div class="absolute top bg-yellow-200 right-0 px-2  lg:flex lg:mx-auto lg:flex lg:items-center lg:w-auto "></div>
        </div>
      </div>
    </div>
  );
}
