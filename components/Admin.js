import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import React from "react";
import ReactDOM from "react-dom";

export default function Admin() {
  return (
    <section className="text-gray-600 body-font">
      <div className=" mx-auto flex px-5 mt-20  flex-col items-center">
        <div className=" pt-16 flex flex-col  mb-1 items-center text-center">
          <h1 className=" sm:text-6xl text-5xl items-center font-medium Avenir tracking-tighter xl:w-2/2 text-gray-900">
            Admin
          </h1>
        </div>
        <div className="border">
          {" "}
          <div></div>
        </div>
        <div className="grid grid-cols-2 gap-4  mt-4">
          <div className="flex tracking-tight justify-center border rounded-lg w-full px-4 py-4 mb-3">
            <ul>
              <li className="w-56 mb-2 flex tracking-tight justify-center text-2xl">
                Featured Items
              </li>
              <li className="flex tracking-tight justify-center text-sm">
                Get Featured Items
              </li>
              <li className="flex tracking-tight justify-center text-sm">
                Set New Featured
              </li>
              <li className="flex tracking-tight justify-center text-sm">
                Remove From Featured
              </li>
            </ul>
          </div>
          <div className="flex tracking-tight justify-center border rounded-lg w-full px-4 py-4 mb-3">
            <ul>
              <li className="w-56 mb-2 flex tracking-tight justify-center text-2xl">
                Blacklisted Items
              </li>
              <li className="flex tracking-tight justify-center text-sm">
                Get Blacklisted Items
              </li>
              <li className="flex tracking-tight justify-center text-sm">
                Add Item to Blacklist
              </li>
              <li className="flex tracking-tight justify-center text-sm">
                Remove Item from Blacklist
              </li>
            </ul>
          </div>
          <div className="flex tracking-tight justify-center border rounded-lg w-full px-4 py-4 mb-28">
            <ul>
              <li className="w-56 mb-2 flex tracking-tight justify-center text-2xl">
                Blacklisted Addresses
              </li>
              <li className="flex tracking-tight justify-center text-sm">
                Get Blacklisted Addresses
              </li>
              <li className="flex tracking-tight justify-center text-sm">
                Add Address to Blacklist
              </li>
              <li className="flex tracking-tight justify-center text-sm">
                Remove Address from Blacklist
              </li>
            </ul>
          </div>

          <div className="flex tracking-tight justify-center border rounded-lg w-full px-4 py-4 mb-28">
            <ul>
              <li className="w-56 mb-2 flex tracking-tight justify-center text-2xl">
                Fees
              </li>
              <li className="flex tracking-tight justify-center text-sm">
                Current Listing Fee
              </li>
              <li className="flex tracking-tight justify-center text-sm">
                Set New Listing Fee
              </li>
              <li className="flex tracking-tight justify-center text-sm">
                Current Market Sale %
              </li>
              <li className="flex tracking-tight justify-center text-sm">
                Set New Listing Sale %
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
