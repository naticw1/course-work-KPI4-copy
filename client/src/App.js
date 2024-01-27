import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
} from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Single from "./pages/Single";
import User from "./pages/User";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Allcomics from "./pages/Allcomics";
import Genres from "./pages/Genres";
import AddComic from "./pages/AddComic";
import Footer_Privacy from "./pages/Footer_Privacy";
import Footer_DMCA from "./pages/FooterDMCA";
import FooterTerms from "./pages/FooterTerms";
import "./style.scss";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/title/:id",
        element: <Single />,
      },
      {
        path: "/title",
        element: <Allcomics />,
      },
      {
        path: "/genre/:genre",
        element: <Genres />,
      },
      {
        path: "/me",
        element: <User />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/add-comic",
        element: <AddComic />,
      },
      {
        path: "/privacy-policy",
        element: <Footer_Privacy />,
      },
      {
        path: "/digital-millennium-copyright-act",
        element: <Footer_DMCA />,
      },
      {
        path: "/terms-of-service",
        element: <FooterTerms />,
      },
    ],
  },
]);

function App() {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
