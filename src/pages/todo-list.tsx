import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  task: string;
  isCompleted: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3002/todoList')  // تغییر به پورت 3002
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching todos');
        }
        return response.json();
      })
      .then(data => setTodos(data))
      .catch(error => console.error('Error fetching todos:', error))
      .finally(() => setLoading(false));
  }, []);

  const addTodo = () => {
    if (newTask.trim() !== '') {
      const newTodo = { id: Date.now(), task: newTask, isCompleted: false };

      fetch('http://localhost:3002/todoList', {  // تغییر به پورت 3002
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error adding todo');
          }
          return response.json();
        })
        .then(data => {
          console.log('Todo added:', data); // بررسی پاسخ سرور
          setTodos([...todos, data]);
        })
        .catch(error => console.error('Error adding todo:', error));

      setNewTask('');
    }
  };

  const toggleTodo = (id: number) => {
    const todoToUpdate = todos.find(todo => todo.id === id);
    if (!todoToUpdate) return;

    const updatedTodo = { ...todoToUpdate, isCompleted: !todoToUpdate.isCompleted };

    setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));

    fetch(`http://localhost:3002/todoList/${id}`, {  // تغییر به پورت 3002
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTodo),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error updating todo');
        }
        console.log('Todo updated:', updatedTodo);
      })
      .catch(error => console.error('Error updating todo:', error));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));

    fetch(`http://localhost:3002/todoList/${id}`, {  // تغییر به پورت 3002
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error deleting todo');
        }
        console.log('Todo deleted:', id);
      })
      .catch(error => console.error('Error deleting todo:', error));
  };

  if (loading) {
    return <p>در حال بارگذاری...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">لیست وظایف</h1>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center justify-between mb-2">
            <span
              onClick={() => toggleTodo(todo.id)}
              className={`cursor-pointer ${todo.isCompleted ? 'line-through' : ''}`}
            >
              {todo.task}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              حذف
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="border p-2 rounded"
          placeholder="اضافه کردن وظیفه جدید"
        />
        <button onClick={addTodo} className="bg-blue-500 text-white px-4 py-2 rounded ml-2">
          اضافه کردن
        </button>
      </div>
    </div>
  );
}
