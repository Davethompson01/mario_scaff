import { AppProps } from 'next/app';
import Head from 'next/head';
import { FC } from 'react';
import Script from 'next/script';
import { ContextProvider } from '../contexts/ContextProvider';
import { AppBar } from '../components/AppBar';
import { ContentContainer } from '../components/ContentContainer';
import { Footer } from '../components/Footer';
import Notifications from '../components/Notification'
require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');

const App: FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <>
          {/* <Script src="https://cdn.jsdelivr.net/npm/kaboom@3000.1.17/dist/kaboom.min.js" /> */}
          <Script
        src="https://unpkg.com/kaboom@0.5.1/dist/kaboom.js"
        strategy="beforeInteractive"
      />
          <Head>
            <title>Solana Scaffold Lite</title>
          </Head>

          <ContextProvider>
            <div className="flex flex-col h-screen">
              <Notifications />
              <AppBar/>
              <ContentContainer>
                <Component {...pageProps} />
                <Footer/>
              </ContentContainer>
            </div>
          </ContextProvider>
        </>
    );
};

export default App;
