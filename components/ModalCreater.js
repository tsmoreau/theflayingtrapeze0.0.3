import { Fragment, useState, useEffect } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Select from "react-select";
import { components } from "react-select";

import { useWeb3React } from "@web3-react/core";
import { nftaddress, nftmarketaddress, IPFSgateway } from "../config";
import NFT from "../abis/NFT.json";
import Market from "../abis/NFTMarket.json";
import pinataSDK from "@pinata/sdk";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");
const options = [
  {
    label: "3D",
    value: "3D"
  },
  {
    label: "Abstract",
    value: "Abstract"
  },
  {
    label: "Animated",
    value: "Animated"
  },
  {
    label: "Design",
    value: "Design"
  },
  {
    label: "Games",
    value: "Games"
  },
  {
    label: "Illustration",
    value: "Illustration"
  },
  {
    label: "Meme",
    value: "Meme"
  },
  {
    label: "Music",
    value: "Music"
  },
  {
    label: "Painting",
    value: "Painting"
  },
  {
    label: "Photo",
    value: "Photo"
  },
  {
    label: "Trash",
    value: "Trash"
  },
  {
    label: "Other",
    value: "Other"
  }
];

const Menu = (props) => {
  const optionSelectedLength = props.getValue().length || 0;
  return (
    <components.Menu {...props}>
      {optionSelectedLength < 2 ? (
        props.children
      ) : (
        <div style={{ margin: 15 }}>Max limit achieved</div>
      )}
    </components.Menu>
  );
};

export default function CreateItem() {
  const [selectedValue, setSelectedValue] = useState([]);
  const [upload, setUpload] = useState([false]);
  const handleChange = (e) => {
    setSelectedValue(Array.isArray(e) ? e.map((x) => x.value) : []);

    updateFormInput({ ...formInput, tags: e.map((x) => x.value) });
  };

  const customStyles = {
    placeholder: (_, { selectProps: { width } }) => ({
      width: width,
      color: "#9ca3af",
      padding: 6
    })
  };

  const pinata = pinataSDK(
    "29f2f68990d82f588d4a",
    "ead631930d0e10c473e047fc3b9a493f43d0cd1002e4513d08b55e92bfdefff3"
  );

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const d = new Date();
  const signer = provider.getSigner();
  const addy = signer.getAddress();

  const {
    active,
    error,
    activate,
    chainId,
    account,
    setError
  } = useWeb3React();

  const isValidNewOption = (inputValue, selectValue) =>
    inputValue.length > 0 && selectValue.length < 3;

  const [fileUrl, setFileUrl] = useState(null);
  const [finalUrl, setFinalUrl] = useState(null);
  const [mintOK, setMintOK] = useState(false);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
    tags: ""
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingMint1, setLoadingMint1] = useState(false);
  const [loadingMint2, setLoadingMint2] = useState(false);

  async function onChange(e) {
    const file = e.target.files[0];

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const increment = 1;
    const itemNumber = await tokenContract.totalSupply();
    const itemNumber2 = itemNumber.toNumber();
    const itemNumberFinal = +itemNumber + +increment;

    try {
      setLoading(true);
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`)
      });

      const name = "illoMX Media";

      const pinName = name + " " + itemNumberFinal + " " + account;
      const options = {
        pinataMetadata: {
          name: pinName,
          keyvalues: {
            customKey: name,
            customKey2: d
          }
        }
      };

      pinata
        .pinByHash(added.path, options)
        .then((result) => {
          //handle results here
          console.log(result);
        })
        .catch((err) => {
          //handle error here
          console.log(err);
        });

      const url = `ipfs://${added.path}`;

      const finalURL = IPFSgateway + url.substring(7);
      setFinalUrl(finalURL);
      setFileUrl(url);
      setLoading(false);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function createMarket() {
    setLoading(true);
    const { name, description, price, tags } = formInput;
    if (!name || !description || !price || !tags || !fileUrl) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);

    //Start DepictMetadata logic

    const increment = 1;
    const itemNumber = await tokenContract.totalSupply();
    const itemNumber2 = itemNumber.toNumber();
    const itemNumberFinal = +itemNumber2 + +increment;
    var pad = "0000000";
    var n = itemNumberFinal;
    var result = (pad + n).slice(-pad.length);
    const block = await provider.getBlockNumber();
    //Network*Project  (Tao & illoMX)
    const depictMeta1 = "001001";
    //Network*Project + TokenId*BlockMinted
    const depictMeta = depictMeta1 + result + block;

    // End DepictMetaData logic

    const externalURL = "https://illo.mx/item/" + itemNumberFinal;

    const data = JSON.stringify({
      name,
      description,
      tags,
      image: fileUrl,
      external_url: externalURL,
      attributes: [
        {
          trait_type: "Network of Mint",
          value: "Tao"
        },
        {
          trait_type: "Platform of Mint",
          value: "illo.mx"
        },
        {
          trait_type: "illoMX Tag",
          value: tags[0]
        },
        {
          trait_type: "illoMX Tag",
          value: tags[1]
        },
        {
          value: "illoMX BETA"
        },
        {
          trait_type: "Depict Metadata",
          value: depictMeta,
          display_type: "number"
        }
      ]
    });

    console.log(tags[0]);
    console.log(tags[1]);

    try {
      const added = await client.add(data);

      const name = "illoMX Metadata";
      const pinName = name + " " + itemNumberFinal + " " + account;
      const options = {
        pinataMetadata: {
          name: pinName,
          keyvalues: {
            customKey: name,
            customKey2: d
          }
        }
      };

      pinata
        .pinByHash(added.path, options)
        .then((result) => {
          //handle results here
          console.log(result);
        })
        .catch((err) => {
          //handle error here
          console.log(err);
        });

      const url = `ipfs://${added.path}`;
      /* after file is uploaded to IPFS, pass the URL to save it on Tao */
      setLoading(false);
      createSale(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function createSale(url) {
    setLoadingMint1(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
    let transaction = await contract.createToken(url);
    let tx = await transaction.wait();
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();
    const price = ethers.utils.parseUnits(formInput.price, "ether");

    const minterCut = 10000;

    setLoadingMint1(false);
    setLoadingMint2(true);
    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    let listingPrice = await contract.fetchListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.createNewMarketItem(
      nftaddress,
      tokenId,
      price,
      minterCut,
      true,
      {
        value: listingPrice
      }
    );
    await transaction.wait();
    setLoadingMint2(false);
    router.push("/market");
  }

  async function uploadImage(e) {
    onChange(e);
    setUpload(true);
  }

  async function uploadCancel() {
    setUpload(false);
    setFinalUrl(null);
  }

  useEffect(() => {
    const { name, description, price, tags } = formInput;
    if (!name || !description || !price || !finalUrl) {
      setMintOK(true);
    } else {
      setMintOK(false);
    }
  });

  return (
    <div className="flex-mx-auto justify-end">
      <div className=" w-15 h-15 max-w-7xl flex mx-auto h-screen flex-col md:flex-col lg:flex-row">
        {/* Image Upload & Display Half */}
        <div className="flex mx-auto w-full h-40 md:h-1/3 lg:h-full md:w-full">
          <div className="border-dashed border-4 w-11/12 flex mx-auto relative h-full md:h-full md:w-3/4 lg:w-full lg:h-3/4  overflow-auto">
            <div className=" absolute top-3 right-3">
              {upload === true ? (
                <button
                  onClick={uploadCancel}
                  class="text-6xl opacity-75 text-gray-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.597 17.954l-4.591-4.55-4.555 4.596-1.405-1.405 4.547-4.592-4.593-4.552 1.405-1.405 4.588 4.543 4.545-4.589 1.416 1.403-4.546 4.587 4.592 4.548-1.403 1.416z" />
                  </svg>
                </button>
              ) : (
                <span className=""></span>
              )}
            </div>

            {upload === true ? (
              <div class=" h-full">
                <div className="self-center h-full overflow-y-auto overflow-x-auto">
                  {fileUrl && (
                    <img
                      alt={finalUrl}
                      className="mx-auto rounded md:mt-2 "
                      src={finalUrl}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="flex mx-auto w-full justify-center text-center items-center">
                <div class=" self-center mb-4   w-48 md:w-48 lg:w-48">
                  <button className="z-0 self-center bg-white  mt-3 md:mt-0  hover:bg-gray-300 text-gray-400 py-2 px-6 w-full flex  inline-flex justify-center items-center">
                    <svg
                      fill="#bfbfbf"
                      height="18"
                      viewBox="0 0 24 24"
                      width="18"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
                    </svg>
                    <span class="">Upload Image</span>
                  </button>
                  <input
                    type="file"
                    accept=".jpg, .jpeg, .png, .gif, .png"
                    name="Image"
                    className="mt-4"
                    class="z-50 border cursor-pointer absolute transform -translate-y-10 block w-48 h-10 opacity-0  pin-r pin-t"
                    onChange={uploadImage}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Boxes & Minting Button Half */}
        <div className="flex flex-col w-full">
          <div className="lg:mt-16 mb-2 lg:justify-center mx-auto lg:mx-auto w-11/12 md:w-3/4 lg:w-3/5 flex flex-col pb-12">
            <input
              placeholder="Name"
              className="mt-2 border rounded-lg p-4 text-gray-500"
              onChange={(e) =>
                updateFormInput({ ...formInput, name: e.target.value })
              }
            />
            <textarea
              placeholder="Description"
              className="mt-2 border rounded-lg p-4 text-gray-500 "
              onChange={(e) =>
                updateFormInput({ ...formInput, description: e.target.value })
              }
            />
            <div className="mt-2">
              <Select
                components={{ Menu }}
                isMulti
                options={options}
                labelledBy={"Select"}
                styles={customStyles}
                value={options.filter((obj) =>
                  selectedValue.includes(obj.value)
                )} // set selected values
                onChange={handleChange}
                maxMenuHeight={250}
                className="w-5xl max-w-3xl text-gray-400 rounded-lg"
                placeholder="illoMX Tags"
              />
            </div>
            <div className="flex">
              <div className="w-full">
                <input
                  placeholder="List Price in XTO"
                  className="w-full mt-2 border rounded p-4 mr-12  rounded-lg text-gray-500"
                  type="number"
                  min="0"
                  onChange={(e) =>
                    updateFormInput({ ...formInput, price: e.target.value })
                  }
                />
              </div>
            </div>

            {mintOK === true ? (
              <div class="w-full">
                <div className="w-full">
                  <button className="w-full mt-4 bg-gray-200  rounded-full text-white font-light text-lg px-3 py-3">
                    Mint NFT
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <button
                  onClick={createMarket}
                  className="w-full mt-4 bg-gradient-to-br from-amber-300 via-rose-600  to-violet-900 hover:amber-200 hover:via-violet-600 hover:to-sky-900 rounded-full text-white font-light text-lg px-3 py-3"
                >
                  Mint NFT
                </button>
              </div>
            )}

            <div className="flex flex-col mt-4 w-3/4 mx-auto text-xs text-gray-300">
              <p className="mx-auto">Market Listing Fee is 0.5 XTO</p>
              <p className="mx-auto">Minter Royalty % is 10%</p>
              <p className="mx-auto">Market Sale % is 2.5%</p>
            </div>
          </div>
        </div>
      </div>

      {/*  Loading Screens  */}

      <div className="">
        {loadingMint1 === true ? (
          <div class="border w-full h-full fixed top-0 left-0 opacity-90 bg-white z-9999">
            <div class=" transform translate-y-72">
              <div class="flex flex-col items-center justify-center ">
                <div className="mb-8 w-1/4 text-gray-400 text-4xl flex mx-auto text-center tracking-tight">
                  Waiting for Token Creation Transaction...
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  class="w-24 h-24 text-gray-400 animate-spin"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm8 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-19 0c0-6.065 4.935-11 11-11v2c-4.962 0-9 4.038-9 9 0 2.481 1.009 4.731 2.639 6.361l-1.414 1.414.015.014c-2-1.994-3.24-4.749-3.24-7.789z" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <span className=""></span>
        )}
      </div>
      <div className="">
        {loading === true ? (
          <div class="border w-full h-full fixed top-0 left-0 opacity-90 bg-white z-9999">
            <div class=" transform translate-y-12">
              <div class="flex flex-col items-center justify-center ">
                <div className="invisible h-40 text-gray-400 text-4xl flex mx-auto text-center tracking-tight"></div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  class="w-24 h-24 text-gray-400 animate-spin"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm8 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-19 0c0-6.065 4.935-11 11-11v2c-4.962 0-9 4.038-9 9 0 2.481 1.009 4.731 2.639 6.361l-1.414 1.414.015.014c-2-1.994-3.24-4.749-3.24-7.789z" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <span className=""></span>
        )}
      </div>
      <div className="">
        {loadingMint2 === true ? (
          <div class="border w-full h-full fixed top-0 left-0 opacity-90 bg-white z-9999">
            <div class=" transform translate-y-72">
              <div class="flex flex-col items-center justify-center ">
                <div className="mb-8 w-1/4 text-gray-400 text-4xl flex mx-auto text-center tracking-tight">
                  Waiting for Marketplace Transaction...
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  class="w-24 h-24 text-gray-400 animate-spin"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm8 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-19 0c0-6.065 4.935-11 11-11v2c-4.962 0-9 4.038-9 9 0 2.481 1.009 4.731 2.639 6.361l-1.414 1.414.015.014c-2-1.994-3.24-4.749-3.24-7.789z" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <span className=""></span>
        )}
      </div>
    </div>
  );
}
