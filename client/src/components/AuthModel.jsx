
import { useState, useContext } from "react";
import { authContext } from "./ContextProvider.jsx";
import "./AuthModel.css";
const AuthModel = ({ setShowAuthModal }) => {
  const { setUser } = useContext(authContext);
  const [reg, setreg] = useState(true);
  const [regform, setregform] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loginform, setloginform] = useState({
    email: "",
    password: "",
  });
  async function HandleReg(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        `
        ${import.meta.env.VITE_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(regform),
        }
      );
      const result = await response.json();
    
      if (result) {
        alert("User created successfully");
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function HandleLogin(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `
        ${import.meta.env.VITE_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginform),
        }
      );
      const result = await response.json();
    
      if (result) {
        setUser(result);
        window.localStorage.setItem("user", JSON.stringify(result));
        setShowAuthModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="Authmodel">
      <button className="close-modal" onClick={() => setShowAuthModal(false)}>
        X
      </button>
      <div className="AuthNav">
        <button onClick={() => setreg((previous) => !previous)}>
          Go To : {reg ? "Login" : "Register"}
        </button>
      </div>
      <div className="Auth-form">
        {reg ? (
          <>
            <h1>REGISTRATION FORM :</h1>
            <form className="Auth-reg-form" onSubmit={(e) => HandleReg(e)}>
              <label>NAME:</label>
              <input
                value={regform.username}
                onChange={(e) =>
                  setregform((formdata) => ({
                    ...formdata,
                    username: e.target.value,
                  }))
                }
              />
              <label>Email:</label>
              <input
                value={regform.email}
                onChange={(e) =>
                  setregform((formdata) => ({
                    ...formdata,
                    email: e.target.value,
                  }))
                }
              />
              <label>PASSWORD: (8 character min.)</label>
              <input
                value={regform.password}
                onChange={(e) =>
                  setregform((formdata) => ({
                    ...formdata,
                    password: e.target.value,
                  }))
                }
              />
              <button type="submit">Submit</button>
            </form>
          </>
        ) : (
          <>
            <h2>LOGIN FORM:</h2>
            <form className="Auth-login-form" onSubmit={(e) => HandleLogin(e)}>
              <label>Email:</label>
              <input
                value={loginform.email}
                onChange={(e) =>
                  setloginform((formdata) => ({
                    ...formdata,
                    email: e.target.value,
                  }))
                }
              />
              <label>PASSWORD:(8 character min.)</label>
              <input
                value={loginform.password}
                onChange={(e) =>
                  setloginform((formdata) => ({
                    ...formdata,
                    password: e.target.value,
                  }))
                }
              />
              <button type="submit">Submit</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModel;
