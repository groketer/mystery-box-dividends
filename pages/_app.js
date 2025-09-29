import '../styles/globals.css'
import Script from 'next/script'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=${process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || 'USD'}`}
        strategy="beforeInteractive"
      />
      <Component {...pageProps} />
    </>
  )
}
