import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md rtl:ml-0">
      <div className="container mx-auto flex justify-between items-center py-4 px-6 rtl:ml-0">
        <div className="flex items-center space-x-6 rtl:space-x-reverse rtl:ml-0">
          <Link href="/" className="text-2xl font-bold hover:text-gray-200 transition-colors duration-300">
            SOS
          </Link>
          <nav className="hidden md:flex space-x-6 rtl:space-x-reverse">
            <Link href="/todo-list" className="hover:text-gray-200 transition-colors duration-300">
              لیست کارها
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
        </div>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">
            ورود
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
