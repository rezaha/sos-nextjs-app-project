import { useRouter } from 'next/router';
import data from '../../../db.json';
import Head from 'next/head';
import Image from 'next/image';

const ArticlePage = () => {
  const router = useRouter();
  const { articleid } = router.query;

  console.log('articleId:', articleid); // بررسی مقدار articleId

  // پیدا کردن مقاله با توجه به ID
  const article = data.articles.find((article) => article.id === parseInt(articleid as string));

  if (!article) {
    return <p>مقاله پیدا نشد</p>;
  }

  return (
    <div>
      <Head>
        <title>{article.title}</title>
      </Head>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <Image 
          src={article.image} 
          alt={article.title} 
          width={500} 
          height={300} 
          className="rounded-t-lg"
        />
        <p className="text-gray-700 mt-4">{article.content}</p>
        <p className="text-gray-500 mt-4">نویسنده: {article.author}</p>
      </div>
    </div>
  );
};

export default ArticlePage;
