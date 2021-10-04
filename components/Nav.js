import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import Connect from "../components/ConnectButton";
import Dashboard from "../components/Buttons/DashboardButton";
import Alert from "./AlertFaux";
import DashboardMobile from "../components/Buttons/DashboardButtonMobile";

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white bg-opacity-90">
      <nav className="sticky top-0 max-w-7xl xl:max-w-full mx-0 lg:mx-12 xl:mx-24 2xl:mx-36 ">
        <div className="">
          <div class=" mx-auto  w-full px-4 py-1 flex justify-between items-center  ">
            <a
              href="/market"
              className="relative lg:-ml-6 text-lg font-medium rounded-lg tracking-widest focus:outline-none focus:shadow-outline"
            >
              <h1 className="lg:ml-2 text-5xl Avenir tracking-tighter text-gray-900 md:text-5x1 lg:text-5xl">
                illoMX
              </h1>
              <span className="hidden absolute font-light text-gray-200 tracking-tight text-xs transform -right-4 -translate-y-2.5">
                beta
              </span>
            </a>

            <div class="hidden    px-2  lg:flex  ">
              <div>
                <ul class="flex pr-2 mt-1.5">
                  <a href="/market">
                    <li class="space-x-0.5 pl-4 pr-3 text-sm text-gray-300 hover:text-white hover:bg-gray-500  rounded-lg px-2 py-1 tracking-tight flex">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        fill="currentColor"
                        className="transform -translate-x-2 translate-y-0.5"
                      >
                        <path d="M9.939 0l-.939 4.971v1.098c0 1.066-.933 1.931-2 1.931s-2-.865-2-1.932v-1.097l2.996-4.971h1.943zm-3.052 0l-2.887 4.971v1.098c0 1.066-.933 1.931-2 1.931s-2-.865-2-1.932v-1.097l4.874-4.971h2.013zm17.113 6.068c0 1.067-.934 1.932-2 1.932s-2-.933-2-2v-1.098l-2.887-4.902h2.014l4.873 4.971v1.097zm-10-1.168v1.098c0 1.066-.934 2.002-2 2.002-1.067 0-2-.933-2-2v-1.098l1.047-4.902h1.905l1.048 4.9zm2.004-4.9l2.994 5.002v1.098c0 1.067-.932 1.9-1.998 1.9s-2-.933-2-2v-1.098l-.939-4.902h1.943zm4.996 12v7h-18v-7h18zm2-2h-22v14h22v-14z" />
                      </svg>
                      Market
                    </li>
                  </a>

                  <li className="hidden">
                    <a
                      class="text-sm text-gray-400 hover:text-gray-700 "
                      href="/dashboard"
                    >
                      dashboard
                    </a>
                  </li>

                  <a href="/faq">
                    <li class="space-x-0.5 pl-4 pr-3 text-sm text-gray-300 hover:text-white hover:bg-gray-500  rounded-lg px-2 py-1 tracking-tight flex">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        fill="currentColor"
                        className="transform  -translate-x-2 translate-y-0.5"
                      >
                        <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1.25 17c0 .69-.559 1.25-1.25 1.25-.689 0-1.25-.56-1.25-1.25s.561-1.25 1.25-1.25c.691 0 1.25.56 1.25 1.25zm1.393-9.998c-.608-.616-1.515-.955-2.551-.955-2.18 0-3.59 1.55-3.59 3.95h2.011c0-1.486.829-2.013 1.538-2.013.634 0 1.307.421 1.364 1.226.062.847-.39 1.277-.962 1.821-1.412 1.343-1.438 1.993-1.432 3.468h2.005c-.013-.664.03-1.203.935-2.178.677-.73 1.519-1.638 1.536-3.022.011-.924-.284-1.719-.854-2.297z" />
                      </svg>
                      FAQ
                    </li>
                  </a>

                  <Dashboard />
                </ul>
              </div>
              <Connect />
            </div>
            <div class="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="bg-gradient-to-br from-amber-300 via-rose-600  to-violet-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#FFFFFF"
                    aria-hidden="true"
                    width="18"
                    height="18"
                    xmlns="http://www.w3.org/2000/svg"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                  >
                    <path d="M24 19h-24v-1h24v1zm0-6h-24v-1h24v1zm0-6h-24v-1h24v1z" />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#FFFFFF"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <Transition show={isOpen}>
          {(ref) => (
            <div class="absolute top-0 left-0 h-screen w-screen z-9999">
              <div class="fixed inset-0 bg-gray-800 opacity-25 "></div>
              <div class="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-xs pt-4 pr-4 pl-4 bg-white border-r overflow-y-auto">
                <div class="flex justify-between mb-6 mx-2">
                  <a
                    href="/"
                    className="text-lg font-normal rounded-lg tracking-widest focus:outline-none focus:shadow-outline"
                  >
                    <h1 className="text-4xl font-semibold Avenir tracking-tighter text-gray-900 md:text-3x1 lg:text-4xl">
                      illoMX
                    </h1>
                    <span className="hidden absolute font-light text-gray-300 tracking-tight text-xs transform translate-x-20 -translate-y-2.5">
                      beta
                    </span>
                  </a>
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    type="button"
                    className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                    aria-controls="mobile-menu"
                    aria-expanded="false"
                  >
                    <svg
                      class="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>
                <div>
                  <ul className="ml-3 mx-2 mt-2 z-9999 justify-center">
                    <li>
                      <a
                        class="pl-6 flex justify-start block w-64 p-4 text-sm  text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded"
                        href="/market"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          fill="currentColor"
                          className="transform -translate-x-2 translate-y-0.5"
                        >
                          <path d="M9.939 0l-.939 4.971v1.098c0 1.066-.933 1.931-2 1.931s-2-.865-2-1.932v-1.097l2.996-4.971h1.943zm-3.052 0l-2.887 4.971v1.098c0 1.066-.933 1.931-2 1.931s-2-.865-2-1.932v-1.097l4.874-4.971h2.013zm17.113 6.068c0 1.067-.934 1.932-2 1.932s-2-.933-2-2v-1.098l-2.887-4.902h2.014l4.873 4.971v1.097zm-10-1.168v1.098c0 1.066-.934 2.002-2 2.002-1.067 0-2-.933-2-2v-1.098l1.047-4.902h1.905l1.048 4.9zm2.004-4.9l2.994 5.002v1.098c0 1.067-.932 1.9-1.998 1.9s-2-.933-2-2v-1.098l-.939-4.902h1.943zm4.996 12v7h-18v-7h18zm2-2h-22v14h22v-14z" />
                        </svg>{" "}
                        Market
                      </a>
                    </li>

                    <li>
                      <a
                        class="pl-6 flex justify-start block w-64 p-4 text-sm  text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded"
                        href="/faq"
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          fill="currentColor"
                          className="transform -translate-x-2 translate-y-0.5"
                        >
                          <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1.25 17c0 .69-.559 1.25-1.25 1.25-.689 0-1.25-.56-1.25-1.25s.561-1.25 1.25-1.25c.691 0 1.25.56 1.25 1.25zm1.393-9.998c-.608-.616-1.515-.955-2.551-.955-2.18 0-3.59 1.55-3.59 3.95h2.011c0-1.486.829-2.013 1.538-2.013.634 0 1.307.421 1.364 1.226.062.847-.39 1.277-.962 1.821-1.412 1.343-1.438 1.993-1.432 3.468h2.005c-.013-.664.03-1.203.935-2.178.677-.73 1.519-1.638 1.536-3.022.011-.924-.284-1.719-.854-2.297z" />
                        </svg>
                        FAQ
                      </a>
                    </li>

                    <li class="mb-1">
                      <DashboardMobile />
                    </li>

                    <li class="mb-1 flex justify-center">
                      <Connect />
                    </li>
                  </ul>
                </div>
                <div class="mt-auto">
                  <p class="my-4 text-xs text-center text-gray-400">
                    <span>Copyright © 2021</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </Transition>
      </nav>
    </div>
  );
}

export default Nav;
