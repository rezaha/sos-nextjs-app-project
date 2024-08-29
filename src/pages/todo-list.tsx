import { useState, useEffect } from 'react';
import Modal from 'react-modal';

interface Todo {
  id: string;
  title: string;
  content: string;
  author: string;
  isCompleted: boolean;
}

Modal.setAppElement('#__next'); // فراخوانی خارج از تابع TodoList

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<Todo>({ id: '', title: '', content: '', author: '', isCompleted: false });
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3002/todoList')
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(error => console.error('Error fetching todos:', error));
  }, []);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

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
          closeModal();
        })
        .catch(error => console.error('Error adding todo:', error));
    }
  };

  const updateInput = (field: keyof Todo, value: string | boolean) => {
    setNewTodo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">لیست وظایف</h1>
      <button onClick={openModal} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        اضافه کردن وظیفه جدید
      </button>
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
      </ul>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="افزودن وظیفه جدید"
        className="bg-white p-4 rounded shadow-lg max-w-md mx-auto mt-10"
      >
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
        <button onClick={closeModal} className="bg-gray-300 text-black px-4 py-2 rounded mt-2 ml-2">
          بستن
        </button>
      </Modal>
    </div>
  );
}
