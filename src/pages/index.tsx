import { useEffect, useState } from "react";
import Head from "next/head";
import { Inter } from "next/font/google";
import Header from "../components/header";
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import Image from 'next/image';
import Link from 'next/link';

// تعریف نوع وظایف
interface Todo {
  id: number;
  task: string;
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
  
  // تعریف نوع `useState` برای `todos`
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetch('http://localhost:3002/todoList')
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(error => console.error('Error fetching todos:', error));
  }, []);

  const addTodo = () => {
    if (newTask.trim() !== '') {
      const newTodo: Todo = { id: Date.now(), task: newTask, isCompleted: false };
      setTodos([...todos, newTodo]);
      setNewTask('');

      fetch('http://localhost:3002/todoList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      }).catch(error => console.error('Error adding todo:', error));
    }
  };

  return (
    <CacheProvider value={cacheRtl}>
      <div className={`min-h-screen bg-gray-100 ${inter.className}`}>
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

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">اضافه کردن وظیفه جدید</h2>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="border p-2 rounded mb-2 w-full"
              placeholder="عنوان وظیفه"
            />
            <button 
              onClick={addTodo} 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
            >
              اضافه کردن وظیفه
            </button>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">لیست وظایف</h2>
            <ul className="list-disc pl-5">
              {todos.map(todo => (
                <li key={todo.id} className={`cursor-pointer ${todo.isCompleted ? 'line-through text-gray-500' : 'text-black'}`}>
                  {todo.task}
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </CacheProvider>
  );
}
