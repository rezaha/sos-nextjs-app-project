import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import path from 'path';
import fs from 'fs';
import { GetServerSideProps } from 'next';

interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  image?: string;
}

interface Todo {
  id: string;
  title: string;
  content: string;
  author: string;
  isCompleted: boolean;
}

interface HomeProps {
  initialArticles: Article[];
  initialTodos: Todo[];
}

export default function Home({ initialArticles, initialTodos }: HomeProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

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

  const deleteArticle = (id: string) => {
    fetch(`http://localhost:3002/articles/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setArticles(articles.filter(article => article.id !== id)); 
        setTodos(todos.filter(todo => todo.id !== id)); 
        toast.success('حذف با موفقیت انجام شد!');
      })
      .catch(error => {
        console.error('Error deleting article:', error);
        toast.error('خطا در حذف مقاله');
      });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer />
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
                  onClick={() => deleteArticle(article.id)} 
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
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const filePath = path.join(process.cwd(), 'db.json');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContent);

  return {
    props: {
      initialArticles: data.articles || [],
      initialTodos: data.todoList || [],
    },
  };
};
