// src/pages/ui/modal.tsx
import { useState } from 'react';
import Modal from 'react-modal';

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (title: string, content: string, author: string) => void;
}

const CustomModal: React.FC<ModalProps> = ({ isOpen, onRequestClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = () => {
    if (title.trim() && content.trim() && author.trim()) {
      onSubmit(title, content, author);
      onRequestClose();
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setAuthor('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="افزودن مقاله جدید"
      className="bg-white p-6 rounded shadow-lg max-w-md mx-auto mt-10"
    >
      <h2 className="text-2xl font-bold mb-4">افزودن مقاله جدید</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="عنوان"
        className="border p-2 rounded mb-2 w-full"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="محتوا"
        className="border p-2 rounded mb-2 w-full"
        rows={3}
      />
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="نویسنده"
        className="border p-2 rounded mb-2 w-full"
      />
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
        اضافه کردن
      </button>
      <button onClick={onRequestClose} className="bg-gray-300 text-black px-4 py-2 rounded mt-2 ml-2">
        بستن
      </button>
    </Modal>
  );
};

export default CustomModal;
