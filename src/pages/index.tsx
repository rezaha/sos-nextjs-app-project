import { useEffect, useState } from "react";
import Head from "next/head";
import { Inter } from "next/font/google";
import Header from "../components/header";
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import Image from 'next/image';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Todo {
  id: string;
  title: string;
  content: string;
  author: string;
  isCompleted: boolean;
}

import data from '../../db.json';

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [rtlPlugin],
});

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { articles: initialArticles } = data;
  const [articles, setArticles] = useState(initialArticles);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const fetchTodos = () => {
      fetch('http://localhost:3002/todoList')
        .then(response => response.json())
        .then(data => {
          setTodos(data);
          setArticles([...initialArticles, ...data]);
        })
        .catch(error => console.error('Error fetching todos:', error));
    };

    fetchTodos();
  }, [initialArticles]);

  const deleteTodo = (id: string) => {
    fetch(`http://localhost:3002/articles/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setArticles(articles.filter(article => article.id !== id)); 
        setTodos(todos.filter(todo => todo.id !== id)); 
        toast.success('حذف با موفقیت انجام شد!'); // نمایش پیام موفقیت‌آمیز
      })
      .catch(error => {
        console.error('Error deleting todo:', error);
        toast.error('خطا در حذف وظیفه');
      });
  };

  return (
    <CacheProvider value={cacheRtl}>
      <ToastContainer />
      <div className={`min-h-screen bg-gray-100 ${inter.className}`}>
        <Head>
          <title>SOS</title>
        </Head>
        <main className="container mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <div key={article.id} className="relative bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <Link href={`/articles/${article.id}`} passHref>
                  <div>
                    <Image 
                      src={article.image || '/default-image.jpg'}
                      alt={article.title}
                      width={500}
                      height={300}
                      className="rounded-t-lg"
                    />
                    <h2 className="text-xl font-semibold mb-4 mt-4">{article.title}</h2>
                    <p className="text-gray-700">{article.content}</p>
                    <p className="text-gray-500 mt-4">نویسنده: {article.author}</p>
                  </div>
                </Link>
                <div className="flex justify-between mt-4">
                  <button 
                    onClick={() => deleteTodo(article.id)} 
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300"
                  >
                    حذف
                  </button>
                  <Link href={`/articles/${article.id}`} passHref>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300">
                      اطلاعات بیشتر
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </CacheProvider>
  );
}
