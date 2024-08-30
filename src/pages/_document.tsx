import { Html, Head, Main, NextScript } from "next/document";
import Header from "@/components/header";

export default function Document() {
  return (
    <Html lang="fa" dir='rtl'>
      <Header/>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
