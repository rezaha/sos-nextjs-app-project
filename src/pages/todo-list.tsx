import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Todo {
  id: string;
  title: string;
  content: string;
  author: string;
  isCompleted: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<Todo>({ id: '', title: '', content: '', author: '', isCompleted: false });

  useEffect(() => {
    fetch('http://localhost:3002/todoList')
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(error => console.error('Error fetching todos:', error));
  }, []);

  const addTodo = () => {
    if (newTodo.title.trim() !== '' && newTodo.content.trim() !== '' && newTodo.author.trim() !== '') {
      const todoToAdd = { ...newTodo, id: Date.now().toString() };

      fetch('http://localhost:3002/todoList', {
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
          toast.success('وظیفه با موفقیت اضافه شد!'); // نمایش پیام موفقیت‌آمیز
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
      <ToastContainer />
      {/* <h1 className="text-2xl font-bold mb-4">لیست وظایف</h1>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center justify-between mb-2">
            <div>
              <h3>{todo.title} - {todo.author}</h3>
              <p>{todo.content}</p>
              <p>{`وضعیت: ${todo.isCompleted ? 'تکمیل شده' : 'در حال انجام'}`}</p>
            </div>
          </li>
        ))}
      </ul> */}

      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto mt-8 relative">
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
        <button onClick={addTodo} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
          اضافه کردن
        </button>
      </div>
    </div>
  );
}
