import Head from "next/head";
import { Inter } from "next/font/google";
import Header from "../components/header";
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import Image from 'next/image';
import Link from 'next/link'; // اضافه کردن لینک

// داده‌ها را از فایل JSON دریافت کنید
import data from '../../db.json';

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [rtlPlugin],
});

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  // استخراج مقالات از داده‌ها
  const { articles } = data;

  return (
    <CacheProvider value={cacheRtl}>
      <div className="min-h-screen bg-gray-100">
        <Head>
          <title>Your Page Title</title>
        </Head>
        <Header />
        <main className="container mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
          <Link key={article.id} href={`/articles/${article.id}`} passHref>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            <Image 
              src={article.image} 
              alt={article.title} 
              width={500} 
              height={300} 
              className="rounded-t-lg"
            />
            <h2 className="text-xl font-semibold mb-4 mt-4">{article.title}</h2>
            <p className="text-gray-700">{article.content}</p>
            <p className="text-gray-500 mt-4">نویسنده: {article.author}</p>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300">
              اطلاعات بیشتر
            </button>
          </div>
        </Link>
            ))}
          </div>
        </main>
      </div>
    </CacheProvider>
  );
}
