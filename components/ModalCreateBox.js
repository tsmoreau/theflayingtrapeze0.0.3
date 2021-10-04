import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

import Modal from "./ModalCreater";

export default function MyModal() {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <div className="">
        <button
          type="button"
          onClick={openModal}
          className="bg-white border-double border-4 border-opacity-80 hover:bg-gray-500 hover:text-white rounded-full text-gray-300 font-light text-xs px-2 py-0.5 mr-0.5"
        >
          CREATE NEW ITEM!
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="border inline-block w-full max-w-full h-screen p-6  overflow-hidden text-left align-middle transition-all transform bg-white">
                <Dialog.Title
                  as="h3"
                  className="text-4xl mt-4 font-semibold tracking-tight leading-6 text-gray-900 text-center mb-4 lg:mb-12"
                >
                  Create New Item
                </Dialog.Title>

                <div className="absolute top-4 right-4 z-50">
                  <button type="button" onClick={closeModal}>
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
                <div className="mt-2">
                  <Modal />
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
