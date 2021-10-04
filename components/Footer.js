export default function Footer() {
  return (
    <footer className="pb-4 pt-16">
      <div className="z-0 max-w-6xl xl:max-w-6xl mx-auto divide-y px-4 sm:px-6 md:px-8">
        <div className="flex flex-col-reverse justify-center pt-5  lg:flex-row bg-top ">
          <ul className="flex mx-auto pt-2">
            <li className="">
              <a
                href="/"
                className="transform -translate-y-1.5 text-md text-gray-400 transition-colors duration-300 hover:text-deep-purple-accent-400 font-light tracking-tight"
              >
                © 2021 Decentralized Pictures LLC.
              </a>
            </li>
          </ul>

          <ul className="items-center text-center flex flex-col md:flex-row mx-auto -space-y-1 space-x-4 lg:mb-0 ">
            <li>
              <a
                href="/"
                className="text-md text-gray-400 transition-colors duration-300 hover:text-deep-purple-accent-400 font-light"
              >
                terms of service
              </a>
            </li>
            <li>
              <a
                href="/"
                className="text-md text-gray-400 transition-colors duration-300 hover:text-deep-purple-accent-400 font-light"
              >
                privacy policy
              </a>
            </li>

            <li>
              <a
                href="/"
                className="text-md text-gray-400 transition-colors duration-300 hover:text-deep-purple-accent-400 font-light"
              >
                contact
              </a>
            </li>
            <div className="">
              <span className="mb-2 space-x-1.5 flex pt-5 pb-2 px-2">
                <a href="https://discord.com">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    fill="#5865F2"
                  >
                    <path d="M19.54 0c1.356 0 2.46 1.104 2.46 2.472v21.528l-2.58-2.28-1.452-1.344-1.536-1.428.636 2.22h-13.608c-1.356 0-2.46-1.104-2.46-2.472v-16.224c0-1.368 1.104-2.472 2.46-2.472h16.08zm-4.632 15.672c2.652-.084 3.672-1.824 3.672-1.824 0-3.864-1.728-6.996-1.728-6.996-1.728-1.296-3.372-1.26-3.372-1.26l-.168.192c2.04.624 2.988 1.524 2.988 1.524-1.248-.684-2.472-1.02-3.612-1.152-.864-.096-1.692-.072-2.424.024l-.204.024c-.42.036-1.44.192-2.724.756-.444.204-.708.348-.708.348s.996-.948 3.156-1.572l-.12-.144s-1.644-.036-3.372 1.26c0 0-1.728 3.132-1.728 6.996 0 0 1.008 1.74 3.66 1.824 0 0 .444-.54.804-.996-1.524-.456-2.1-1.416-2.1-1.416l.336.204.048.036.047.027.014.006.047.027c.3.168.6.3.876.408.492.192 1.08.384 1.764.516.9.168 1.956.228 3.108.012.564-.096 1.14-.264 1.74-.516.42-.156.888-.384 1.38-.708 0 0-.6.984-2.172 1.428.36.456.792.972.792.972zm-5.58-5.604c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332.012-.732-.54-1.332-1.224-1.332zm4.38 0c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332 0-.732-.54-1.332-1.224-1.332z" />
                  </svg>
                </a>

                <a href="https://twitter.com/illo_mx">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="#1DA1F2"
                  >
                    <path d="M.5 18.7c10 6.2 22.7-.7 22.5-13 1-.7 1.9-1.6 2.6-2.7-1 .5-2 .8-3.1.9 1.14-.7 2-1.7 2.4-2.9-1 .6-2 1-3.3 1.3-4.3-4.13-10 .3-8.8 4.7-4.3-.2-8-2.3-10.6-5.4C1 4 1.5 7.1 3.9 8.5 3 8.4 2 8.2 1.5 7.8c0 2.6 1.8 4.6 4.1 5.1-.8.2-1.5.3-2.3.1.6 2 2.6 3.6 4.8 3.6-2 1.6-4.7 2.4-7.6 2.1z" />
                  </svg>
                </a>
              </span>
              <span className="px-1 hidden">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                >
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm-2.426 14.741h-3.574v-.202l1.261-1.529c.134-.139.195-.335.162-.526v-5.304c.015-.147-.041-.293-.151-.392l-1.121-1.35v-.201h3.479l2.689 5.897 2.364-5.897h3.317v.201l-.958.919c-.083.063-.124.166-.106.269v6.748c-.018.103.023.206.106.269l.936.919v.201h-4.706v-.201l.969-.941c.095-.095.095-.123.095-.269v-5.455l-2.695 6.844h-.364l-3.137-6.844v4.587c-.026.193.038.387.174.526l1.26 1.529v.202z" />
                </svg>
              </span>

              <span className=""></span>
            </div>
          </ul>
        </div>
      </div>
    </footer>
  );
}
