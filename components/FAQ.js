import { Disclosure, Transition } from "@headlessui/react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  PlusIcon,
  MinusIcon
} from "@heroicons/react/solid";
export default function FAQ() {
  return (
    <section className="text-gray-600 body-font">
      <div className=" flex px-5 mt-20  flex-col items-center mb-28">
        <div className=" pt-16 flex flex-col ">
          <h1 className=" sm:text-6xl text-5xl items-center font-medium Avenir tracking-tight xl:w-2/2 text-gray-900">
            FAQ
          </h1>
        </div>

        <Disclosure className="flex flex-col mx-auto w-3/4 md:w-2/3 lg:w-1/2">
          {({ open }) => (
            <>
              <Disclosure.Button className="mt-2 w-3/4 md:w-2/3 lg:w-1/2 px-4 pt-8 flex justify-between">
                <span className="text-2xl">Beginner</span>
                <PlusIcon
                  className={`${open ? "hidden" : ""} w-5 h-5 text-gray-500`}
                />
                <MinusIcon
                  className={`${open ? "" : "hidden"} w-5 h-5 text-gray-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="w-3/4 md:w-2/3 lg:w-1/2">
                <Disclosure className="">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="mx-auto px-6 w-11/12 bg-gray-100 mb-0 mt-3 px-5 py-3 rounded-lg flex justify-between">
                        <span className="">What are NFTs?</span>
                        <PlusIcon
                          className={`${
                            open ? "hidden" : ""
                          } w-5 h-5 text-gray-500`}
                        />
                        <MinusIcon
                          className={`${
                            open ? "" : "hidden"
                          } w-5 h-5 text-gray-500`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="mx-auto pr-16 pl-20 pt-4 pb-2 text-normal text-gray-500">
                        NFTs (Non-Fungible Tokens) are unique digital items
                        provable associated with a blockchain address. They come
                        in many forms, but the most common is just a single
                        image.
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                <Disclosure className="">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="mx-auto px-6 w-11/12 bg-gray-100 mb-0 mt-1.5 px-5 py-3 rounded-lg flex justify-between">
                        <span className="">What is illoMX?</span>
                        <PlusIcon
                          className={`${
                            open ? "hidden" : ""
                          } w-5 h-5 text-gray-500`}
                        />
                        <MinusIcon
                          className={`${
                            open ? "" : "hidden"
                          } w-5 h-5 text-gray-500`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="mx-auto pr-16 pl-20 pt-4 pb-2 text-normal text-gray-500">
                        illo.mx is a distributed application for making,
                        displaying, and selling NFTs. illoMX's NFTs run on the
                        environmentally friendly, Ethereum-compatible, Tao
                        blockchain.
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                <Disclosure className="">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="mx-auto px-6 w-11/12 bg-gray-100 mb-0 mt-1.5 px-5 py-3 rounded-lg flex justify-between">
                        <span className="">What is XTO?</span>
                        <PlusIcon
                          className={`${
                            open ? "hidden" : ""
                          } w-5 h-5 text-gray-500`}
                        />
                        <MinusIcon
                          className={`${
                            open ? "" : "hidden"
                          } w-5 h-5 text-gray-500`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="mx-auto pr-16 pl-20 pt-4 pb-2 text-normal text-gray-500">
                        The native currency of the Tao network is represented by
                        the symbol XTO. All items on illoMX are priced in XTO.
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                <Disclosure className="">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="mx-auto px-6 w-11/12 bg-gray-100 mb-0 mt-1.5 px-5 py-3 rounded-lg flex justify-between">
                        <span className="">How do I get XTO?</span>
                        <PlusIcon
                          className={`${
                            open ? "hidden" : ""
                          } w-5 h-5 text-gray-500`}
                        />
                        <MinusIcon
                          className={`${
                            open ? "" : "hidden"
                          } w-5 h-5 text-gray-500`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="mx-auto pr-16 pl-20 pt-4 pb-2 text-normal text-gray-500">
                        XTO is currently available at qtrade.io and alt.market.
                        You can also apply for our Creator Grant Program, which
                        provides artists with limited amounts XTO to fund
                        minting costs. We are currently looking into
                        establishing bridges to allow wrapped XTO on UniSwap and
                        more.
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <Disclosure className="flex flex-col mx-auto w-3/4 md:w-2/3 lg:w-1/2">
          {({ open }) => (
            <>
              <Disclosure.Button className="mt-2 w-3/4 md:w-2/3 lg:w-1/2 px-4 pt-8 flex justify-between">
                <span className="text-2xl">Intermediate</span>
                <PlusIcon
                  className={`${open ? "hidden" : ""} w-5 h-5 text-gray-500`}
                />
                <MinusIcon
                  className={`${open ? "" : "hidden"} w-5 h-5 text-gray-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="w-3/4 md:w-2/3 lg:w-1/2">
                <Disclosure className="">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="mx-auto px-6 w-11/12 bg-gray-100 mb-0 mt-3 px-5 py-3 rounded-lg flex justify-between">
                        <span className="">How do I use illoMX?</span>
                        <PlusIcon
                          className={`${
                            open ? "hidden" : ""
                          } w-5 h-5 text-gray-500`}
                        />
                        <MinusIcon
                          className={`${
                            open ? "" : "hidden"
                          } w-5 h-5 text-gray-500`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="mx-auto pr-12 pl-20 pt-4 pb-2 text-sm text-gray-500">
                        illo.mx is a nft marketplace dapp running on the Tao
                        Blockchain. Our smart contract addresses are:
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                <Disclosure className="">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="mx-auto px-6 w-11/12 bg-gray-100 mb-0 mt-1.5 px-5 py-3 rounded-lg flex justify-between">
                        <span className="">
                          Does illoMX have Content Restrictions?
                        </span>
                        <PlusIcon
                          className={`${
                            open ? "hidden" : ""
                          } w-5 h-5 text-gray-500`}
                        />
                        <MinusIcon
                          className={`${
                            open ? "" : "hidden"
                          } w-5 h-5 text-gray-500`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="mx-auto pr-12 pl-20 pt-4 pb-2 text-sm text-gray-500">
                        illo.mx is a nft marketplace dapp running on the Tao
                        Blockchain. Our smart contract addresses are:
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <Disclosure className="flex flex-col mx-auto w-3/4 md:w-2/3 lg:w-1/2">
          {({ open }) => (
            <>
              <Disclosure.Button className="mt-2 w-3/4 md:w-2/3 lg:w-1/2 px-4 pt-8 flex justify-between">
                <span className="text-2xl">Advanced</span>
                <PlusIcon
                  className={`${open ? "hidden" : ""} w-5 h-5 text-gray-500`}
                />
                <MinusIcon
                  className={`${open ? "" : "hidden"} w-5 h-5 text-gray-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="w-3/4 md:w-2/3 lg:w-1/2">
                <Disclosure className="">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="mx-auto px-6 w-11/12 bg-gray-100 mb-0 mt-3 px-5 py-3 rounded-lg flex justify-between">
                        <span className="">What is the illoMX Roadmap?</span>
                        <PlusIcon
                          className={`${
                            open ? "hidden" : ""
                          } w-5 h-5 text-gray-500`}
                        />
                        <MinusIcon
                          className={`${
                            open ? "" : "hidden"
                          } w-5 h-5 text-gray-500`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="mx-auto pr-16 pl-20 pt-4 pb-2 text-sm text-gray-500">
                        illo.mx is a nft marketplace dapp running on the Tao
                        Blockchain. Our smart contract addresses are:
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                <Disclosure className="">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="mx-auto px-6 w-11/12 bg-gray-100 mb-0 mt-1.5 px-5 py-3 rounded-lg flex justify-between">
                        <span className="">
                          What are the illoMX Smart Contract Addresses?
                        </span>
                        <PlusIcon
                          className={`${
                            open ? "hidden" : ""
                          } w-5 h-5 text-gray-500`}
                        />
                        <MinusIcon
                          className={`${
                            open ? "" : "hidden"
                          } w-5 h-5 text-gray-500`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="mx-auto pr-16 pl-20 pt-4 pb-2 text-sm text-gray-500">
                        illo.mx is a nft marketplace dapp running on the Tao
                        Blockchain. Our smart contract addresses are:
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                <Disclosure className="">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="mx-auto px-6 w-11/12 bg-gray-100 mb-0 mt-1.5 px-5 py-3 rounded-lg flex justify-between">
                        <span className="">What services does illoMX use?</span>
                        <PlusIcon
                          className={`${
                            open ? "hidden" : ""
                          } w-5 h-5 text-gray-500`}
                        />
                        <MinusIcon
                          className={`${
                            open ? "" : "hidden"
                          } w-5 h-5 text-gray-500`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="mx-auto pr-12 pl-20 pt-4 pb-2 text-sm text-gray-500">
                        illo.mx is a nft marketplace dapp running on the Tao
                        Blockchain. Our smart contract addresses are:
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                <Disclosure className="">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="mx-auto px-6 w-11/12 bg-gray-100 mb-0 mt-1.5 px-5 py-3 rounded-lg flex justify-between">
                        <span className="">
                          Do you have a platform/governance token?
                        </span>
                        <PlusIcon
                          className={`${
                            open ? "hidden" : ""
                          } w-5 h-5 text-gray-500`}
                        />
                        <MinusIcon
                          className={`${
                            open ? "" : "hidden"
                          } w-5 h-5 text-gray-500`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="mx-auto pr-12 pl-20 pt-4 pb-2 text-sm text-gray-500">
                        illo.mx is a nft marketplace dapp running on the Tao
                        Blockchain. Our smart contract addresses are:
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </section>
  );
}
