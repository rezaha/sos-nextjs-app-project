import { useEffect, useState } from "react";
import Head from "next/head";
import { Inter } from "next/font/google";
import Header from "../components/header";
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import Image from 'next/image';
import Link from 'next/link';
import Modal from 'react-modal';

// تعریف نوع وظایف
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

Modal.setAppElement('#__next'); // تنظیم element اصلی برای مودال

export default function Home() {
  const { articles: initialArticles } = data;
  const [articles, setArticles] = useState(initialArticles);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    fetch('http://localhost:3002/todoList')
      .then(response => response.json())
      .then(data => {
        setTodos(data);
        setArticles([...initialArticles, ...data]); // اضافه کردن todos به articles
      })
      .catch(error => console.error('Error fetching todos:', error));
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const addTodo = () => {
    if (newTask.trim() !== '') {
      const newTodo: Todo = { id: Date.now().toString(), title: newTask, content: 'محتوای پیش‌فرض', author: 'نویسنده پیش‌فرض', isCompleted: false };

      fetch('http://localhost:3002/todoList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      })
        .then(response => response.json())
        .then(() => {
          setNewTask('');
          fetchTodos(); // فراخوانی مجدد API برای به‌روزرسانی لیست با داده‌های جدید
        })
        .catch(error => console.error('Error adding todo:', error));

      closeModal(); // بستن مودال بعد از اضافه شدن وظیفه
    }
  };

  const deleteTodo = (id: string) => {
    fetch(`http://localhost:3002/todoList/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setArticles(articles.filter(article => article.id !== id)); // حذف از لیست articles
        setTodos(todos.filter(todo => todo.id !== id)); // حذف از لیست todos
      })
      .catch(error => console.error('Error deleting todo:', error));
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
              <div key={article.id} className="relative bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <Link href={`/articles/${article.id}`} passHref>
                  <div>
                    <Image 
                      src={article.image || '/default-image.jpg'} // بررسی وجود تصویر یا نمایش تصویر پیش‌فرض
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

          <div className="mt-8">
            <button 
              onClick={openModal} 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
            >
              اضافه کردن وظیفه جدید
            </button>
          </div>

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="افزودن وظیفه جدید"
            className="bg-white p-4 rounded shadow-lg max-w-md mx-auto mt-10"
          >
            <h2 className="text-2xl font-bold mb-4">افزودن وظیفه جدید</h2>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="عنوان وظیفه"
              className="border p-2 rounded mb-2 w-full"
            />
            <button onClick={addTodo} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
              اضافه کردن
            </button>
            <button onClick={closeModal} className="bg-gray-300 text-black px-4 py-2 rounded mt-2 ml-2">
              بستن
            </button>
          </Modal>
        </main>
      </div>
    </CacheProvider>
  );
}
