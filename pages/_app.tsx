import '../styles/globals.css'
import 'tailwindcss/tailwind.css';
import React from 'react'
import { Windmill } from '@roketid/windmill-react-ui'
import type { AppProps } from 'next/app'
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  // suppress useLayoutEffect warnings when running outside a browser
  if (!process.browser) React.useLayoutEffect = React.useEffect;

  return (
    <>
      <Head>
        <title>aldrich financial</title>
        <link rel="shortcut icon" href="https://aldrich-portfolio-blog2.vercel.app/favicon1.ico" />
        <meta name="description" content="this is aldrich financial" />
        <meta name="og:title" content="aldrich financial" />
        <meta name="og:description" content="this is aldrich financial" />
        <meta name="og:image" content="https://aldrich-portfolio-blog2.vercel.app/favicon1.ico" />
        <meta name="og:url" content="aldnancial.store" />
        <meta name="og:type" content="website" />
        <meta name="og:site_name" content="Aldrich Financial" />
        <meta name="og:locale" content="ko_KR" />
      </Head>
      <Windmill usePreferences={true}>
        <Component {...pageProps} />
      </Windmill>
    </>
  )
}
export default MyApp
