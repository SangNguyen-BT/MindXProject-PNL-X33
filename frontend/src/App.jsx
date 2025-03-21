import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { setupRouter } from "./routes/setupRouter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

import Footer from "./components/Footer";

import Navbar from "./components/Navbar";
import ScrollTopTop from "./components/detailmoviepage/ScrollToTop";

import { Responsive } from "./components/Responsive";
import TicketInfo from './components/ticket/TicketInfo';
export const backendUrl = import.meta.env.VITE_BACKEND_URL

function App() {
  const [userName, setUserName] = useState(null);

 
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar userName={userName} setUserName={setUserName} responsive={Responsive} />
      <main className="flex-1 pt-20">
        <ToastContainer responsive={Responsive} />
        <Routes>
          {setupRouter.map((route, index) => {
            const Page = route.component;
            return <Route path={route.url} key={index} element={<Page setUserName={setUserName} />} />;
          })}
        </Routes>
        <ScrollTopTop responsive={Responsive}/>
      </main>
      <Footer responsive={Responsive} />
    </div>
  );
}

export default App;
