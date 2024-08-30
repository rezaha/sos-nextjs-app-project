import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function upload(req: NextApiRequest, res: NextApiResponse) {
  const form = new IncomingForm({
    uploadDir: path.join(process.cwd(), '/public/images/articles'),
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error parsing the files', err);
      return res.status(500).json({ message: 'Error parsing the files' });
    }

    if (!files.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const fileName = file.originalFilename || file.newFilename; // برای دریافت نام فایل
    const relativePath = `/images/articles/${fileName}`; // مسیر نسبی

    res.status(200).json({ filePath: relativePath });
  });
}
