import "../styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import type Liff from "@line/liff";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Image } from "antd";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  const [liffObject, setLiffObject] = useState<typeof Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  // Execute liff.init() when the app is initialized

  // Provide `liff` object and `liffError` object
  // to page component as property
  // pageProps.liff = liffObject;
  // pageProps.liffError = liffError;
  // pageProps.liffProfile = profile;
  // pageProps.loggedIn =

  return (
    <div>
      <Head>
        <title>Aquater Line Service</title>
        <meta charSet="UTF-8" />

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="viewport"
          content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="HandheldFriendly" content="true" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Component {...pageProps} />
    </div>
  );

  // return <Component {...pageProps} />;
}

export default MyApp;
