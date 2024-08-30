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

        let imagePath = 'public/images/articles/123.jpg'; // مسیر تصویر پیش‌فرض

        if (image) {
            const formData = new FormData();
            formData.append('file', image);

            const response = await axios.post('/api/upload', formData);
            if (response.data.filePath) {
                imagePath = response.data.filePath; // استفاده از مسیر تصویر آپلود شده
            }
        }

        const newArticle = {
            id: Date.now().toString(),
            title,
            content,
            author,
            image: imagePath, // ذخیره مسیر تصویر
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
        <form onSubmit={handleSubmit}>
            <div>
                <label>عنوان</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
                <label>محتوا</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
            <div>
                <label>نویسنده</label>
                <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
            </div>
            <div>
                <label>تصویر</label>
                <input type="file" onChange={handleFileChange} />
            </div>
            <button type="submit">اضافه کردن مقاله</button>
        </form>
    );
}
