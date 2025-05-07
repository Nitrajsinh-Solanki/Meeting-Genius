// Meeting-Genius\client\src\components\Layout.jsx


import Footer from "./Footer.jsx";
import Header from "./Header.jsx";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="main_layout">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
