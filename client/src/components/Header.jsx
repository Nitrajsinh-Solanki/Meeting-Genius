
import { useContext } from "react";
import { authContext } from "./ContextProvider.jsx";
import "./Header.css";

const Header = () => {
  const { user, setShowAuthModal, setUser } = useContext(authContext);

  async function handleLoginSignup() {
    setShowAuthModal(true);
  }

  async function handleLogout() {
    setUser(null);
    window.localStorage.removeItem("user");
  }

  return (
    <div className="header">
      <h1 className="header-title">Meeting Insights Generator</h1>

      <div className="profile">
        {user ? (
          <>
            <p className="username">{user.username}</p>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="login-btn" onClick={handleLoginSignup}>
            Login/Sign up
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
