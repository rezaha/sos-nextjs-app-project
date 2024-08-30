
import React from 'react';
import Header from './header'; 

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Header /> 
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
