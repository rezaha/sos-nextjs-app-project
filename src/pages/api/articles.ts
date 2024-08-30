import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const newArticle = req.body;

        // مسیر به فایل db.json
        const filePath = path.join(process.cwd(), 'db.json');

        // خواندن فایل db.json
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContent);

        // اضافه کردن مقاله جدید به لیست مقالات
        data.articles.push(newArticle);

        // نوشتن دوباره فایل db.json
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        res.status(200).json({ message: 'مقاله با موفقیت اضافه شد!' });
    } else {
        res.status(405).json({ message: 'Only POST requests are allowed' });
    }
}
