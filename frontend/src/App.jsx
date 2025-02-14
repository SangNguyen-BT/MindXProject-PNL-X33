import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { setupRouter } from "./routes/setupRouter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

import Footer from "./components/Footer";

import Navbar from "./components/Navbar";
import ScrollTopTop from "./components/detailmoviepage/ScrollToTop";

export const backendUrl = import.meta.env.VITE_BACKEND_URL

function App() {
  const [userName, setUserName] = useState(null)
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 7
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
};

  return (
    <>
      <div className="bg-black relative pt-20">
        <Navbar userName={userName} setUserName={setUserName} responsive={responsive}/>
        <ToastContainer responsive={responsive} />
        <Routes>
          {setupRouter.map((route, index) => {
            const Page = route.component;
            return <Route path={route.url} key={index} element={<Page setUserName={setUserName}/>} responsive={responsive}/>;
          })}
        </Routes>
        <ScrollTopTop responsive={responsive}/>
      <Footer responsive={responsive} />
      </div>
    </>
  );
}

export default App;
