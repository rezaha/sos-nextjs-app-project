import { useState } from 'react';
import axios from 'axios';

export default function AddArticle() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imagePath = '/images/articles/default.jpg'; 

    if (image) {
      const formData = new FormData();
      formData.append('file', image);

      const response = await axios.post('/api/upload', formData);
      if (response.data.filePath) {
        imagePath = response.data.filePath; 
      }
    }

    const newArticle = {
      id: Date.now().toString(),
      title,
      content,
      author,
      image: imagePath,
    };

    const response = await fetch('/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newArticle),
    });

    if (response.ok) {
      alert('مقاله با موفقیت اضافه شد!');
      setTitle('');
      setContent('');
      setAuthor('');
      setImage(null);
    } else {
      alert('خطایی رخ داد. لطفاً دوباره تلاش کنید.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto mt-8">
      <div className="mb-4">
        <label className="block text-gray-700">عنوان</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-b-2 border-blue-500 p-2 w-full focus:outline-none focus:border-blue-700 bg-white text-gray-900"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">محتوا</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border-b-2 border-blue-500 p-2 w-full focus:outline-none focus:border-blue-700 bg-white text-gray-900"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">نویسنده</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="border-b-2 border-blue-500 p-2 w-full focus:outline-none focus:border-blue-700 bg-white text-gray-900"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">تصویر</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="border-b-2 border-blue-500 p-2 w-full focus:outline-none focus:border-blue-700 bg-white text-gray-900"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        اضافه کردن مقاله
      </button>
    </form>
  );
}
