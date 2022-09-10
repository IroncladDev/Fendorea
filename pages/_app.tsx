import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <title>Fendorea</title>
      <meta name="description" content="Share, create, and discuss AI-generated images created by the Stable Diffusion model!" />
      <link rel="icon" href="/logo.svg" />
    </Head>
    <Component {...pageProps} />
  </>
}