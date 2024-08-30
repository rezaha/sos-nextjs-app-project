import { useState } from 'react';
import Link from 'next/link';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md rtl:ml-0">
      <div className="container mx-auto flex justify-between items-center py-4 px-6 rtl:ml-0">
        <Link href="/" className="text-2xl font-bold hover:text-gray-200 transition-colors duration-300">
          SOS
        </Link>
        <nav className="hidden md:flex space-x-6 rtl:space-x-reverse">
          <Link href="/todo-list" className="hover:text-gray-200 transition-colors duration-300">
            اضافه کردن مقاله 
          </Link>
          <Link href="/health-centers" className="hover:text-gray-200 transition-colors duration-300">
            مراکز خدمات درمانی
          </Link>
          <Link href="/branches" className="hover:text-gray-200 transition-colors duration-300">
            شعب ما
          </Link>
          <Link href="/faq" className="hover:text-gray-200 transition-colors duration-300">
            سوالات متداول
          </Link>
        </nav>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <button className="bg-gray-200 text-gray-600 font-semibold py-1 px-8 rounded-lg transition-colors duration-300 text-sm hover:bg-gray-300">
            ورود و عضویت
          </button>
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="focus:outline-none">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } md:hidden bg-blue-600 text-white p-4 space-y-2 transition-all duration-300 ease-in-out transform ${
          isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
        }`}
      >
        <Link href="/todo-list" className="block hover:text-gray-200 transition-colors duration-300">
          اضافه کردن مقاله
        </Link>
        <Link href="/health-centers" className="block hover:text-gray-200 transition-colors duration-300">
          مراکز خدمات درمانی
        </Link>
        <Link href="/branches" className="block hover:text-gray-200 transition-colors duration-300">
          شعب ما
        </Link>
        <Link href="/faq" className="block hover:text-gray-200 transition-colors duration-300">
          سوالات متداول
        </Link>
      </div>
    </header>
  );
};

export default Header;
