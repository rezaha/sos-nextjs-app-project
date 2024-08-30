import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import 'react-toastify/dist/ReactToastify.css';

interface Todo {
  id: string;
  title: string;
  content: string;
  author: string;
  image?: string; 
  isCompleted: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<Todo>({ id: '', title: '', content: '', author: '', isCompleted: false });
  const [image, setImage] = useState<File | null>(null); 
  const [isVisible, setIsVisible] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:3002/articles')
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(error => console.error('Error fetching todos:', error));

    setTimeout(() => setIsVisible(true), 100); 
  }, []);

  const addTodo = async () => {
    if (newTodo.title.trim() !== '' && newTodo.content.trim() !== '' && newTodo.author.trim() !== '') {
      let imagePath = '/images/articles/default.jpg'; 

      if (image) {
        const formData = new FormData();
        formData.append('file', image);

        try {
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          const uploadResult = await uploadResponse.json();
          if (uploadResponse.ok) {
            imagePath = uploadResult.filePath; 
          } else {
            toast.error('خطا در آپلود تصویر');
            return;
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          toast.error('خطا در آپلود تصویر');
          return;
        }
      }

      const todoToAdd = { ...newTodo, id: Date.now().toString(), image: imagePath };

      fetch('http://localhost:3002/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoToAdd),
      })
        .then(response => response.json())
        .then(data => {
          setTodos([...todos, data]);
          setNewTodo({ id: '', title: '', content: '', author: '', isCompleted: false });
          setImage(null); 
          toast.success('وظیفه با موفقیت اضافه شد!');
        })
        .catch(error => {
          console.error('Error adding todo:', error);
          toast.error('خطا در اضافه کردن وظیفه');
        });
    }
  };

  const updateInput = (field: keyof Todo, value: string | boolean) => {
    setNewTodo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className={`bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto mt-8 relative ${isVisible ? 'animate-fade-slide' : 'opacity-0'}`}>
        <h2 className="text-2xl font-bold mb-4">افزودن وظیفه جدید</h2>
        <input
          type="text"
          value={newTodo.title}
          onChange={e => updateInput('title', e.target.value)}
          placeholder="عنوان"
          className="border p-2 rounded mb-2 w-full"
        />
        <textarea
          value={newTodo.content}
          onChange={e => updateInput('content', e.target.value)}
          placeholder="محتوا"
          className="border p-2 rounded mb-2 w-full"
        />
        <input
          type="text"
          value={newTodo.author}
          onChange={e => updateInput('author', e.target.value)}
          placeholder="نویسنده"
          className="border p-2 rounded mb-2 w-full"
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          className="border p-2 rounded mb-2 w-full"
        />
        <button onClick={addTodo} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
          اضافه کردن
        </button>

        <button
          onClick={() => router.push('/')}
          className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-transform transform hover:scale-110"
          style={{ width: '40px', height: '40px', fontSize: '24px' }}
        >
          ←
        </button>
      </div>
    </div>
  );
}
