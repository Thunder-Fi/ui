import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import { useState, useEffect } from "react";

import "@fontsource/barlow/600.css";
import "@fontsource/roboto-condensed/700.css";

import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { goerli } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

const PROJECT_ID = "6e7a3e8457a2ec975cb7e44a0a791443";

const { chains, publicClient } = configureChains(
  [goerli],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: "https://ethereum-goerli.publicnode.com",
      }),
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "ThunderFi",
  projectId: PROJECT_ID,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
export default function App({ Component, pageProps }) {
  const toastStyle = {
    fontFamily: "Roboto Condensed",
  };

  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  const customTheme = extendTheme({
    styles: {
      global: {
        body: {
          margin: 0,
          padding: 0,
          background:
            "linear-gradient(315deg, rgba(255,253,224,1) 0%, rgba(226,255,247,1) 76%, rgba(214,253,255,1) 100%)",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        },
      },
    },
  });

  return (
    <>
      {ready ? (
        <>
          <ChakraProvider theme={customTheme}>
            <WagmiConfig config={wagmiConfig}>
              <RainbowKitProvider chains={chains} modalSize="compact">
                <Component {...pageProps} />
                <ToastContainer
                  toastStyle={toastStyle}
                  position="top-center"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick={false}
                  rtl={false}
                  pauseOnFocusLoss={false}
                  draggable={false}
                  pauseOnHover={false}
                  theme="dark"
                  transition={Flip}
                />
              </RainbowKitProvider>
            </WagmiConfig>
          </ChakraProvider>
        </>
      ) : null}
    </>
  );
}
