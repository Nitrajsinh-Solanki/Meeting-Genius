
import Content from "./components/Content";
import "./App.css";
import Layout from "./components/Layout";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ContextProvider } from "./components/ContextProvider";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Content />,
      },
     
    ],
  },
]);

function App() {
  return (
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  );
}

export default App;