import React, { useState } from "react";
import { toast } from "react-toastify";
import {Responsive} from "../Responsive"
const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi thông tin liên hệ ở đây
    toast.success("Thank you for submitting your contact information!");
    setName("");
    setEmail("");
    setMessage("");
  };
  
  return (
    <div className="bg-black min-h-screen p-6 px-[180px] " responsive={Responsive}>
      <h1 className="text-4xl text-red-600 font-bold mb-8">Contact</h1>
      <p className="text-white mb-6">
      We are always ready to listen to your opinions.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="name">
            Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded focus:outline-none focus:ring focus:ring-red-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded focus:outline-none focus:ring focus:ring-red-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="message">
            Message:
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded focus:outline-none focus:ring focus:ring-red-500"
            rows="4"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full p-3 bg-red-600 text-white font-semibold rounded hover:bg-red-500 transition duration-300"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Contact;
