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
        toast.success('حذف با موفقیت انجام شد!', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          style: { 
            borderBottom: '4px solid #ff4d4d', // رنگ قرمز برای نوار زیرین
          },
        });
      })
      .catch(error => {
        console.error('Error deleting article:', error);
        toast.error('خطا در حذف مقاله', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          style: { 
            borderBottom: '4px solid #ff4d4d', // رنگ قرمز برای نوار زیرین
          },
        });
      });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer />
      <Head>
        <title>SOS</title>
      </Head>
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div key={article.id} className="relative bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <Link href={`/articles/${article.id}`} passHref>
                <div>
                  <Image 
                    src={article.image || '/default-image.jpg'}
                    alt={article.title}
                    width={400}
                    height={250}
                    className="rounded-t-lg"
                  />
                  <h2 className="text-lg font-semibold mb-3 mt-3">{article.title}</h2>
                  <p className="text-gray-700">{article.content}</p>
                  <p className="text-gray-500 mt-3">نویسنده: {article.author}</p>
                </div>
              </Link>
              <div className="flex justify-between mt-3">
                <button 
                  onClick={() => deleteArticle(article.id)} 
                  className="text-red-600 bg-red-100 text-sm px-2 py-1 rounded hover:bg-red-200 transition-colors duration-300"
                >
                  حذف
                </button>
                <Link href={`/articles/${article.id}`} passHref>
                  <button className="text-blue-600 bg-blue-100 text-sm px-2 py-1 rounded hover:bg-blue-200 transition-colors duration-300">
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
