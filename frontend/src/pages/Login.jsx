import React, { useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom"
import {toast} from "react-toastify"

import {backendUrl} from "../App"

import {Responsive} from "../components/Responsive"

const Login = ({setUserName}) => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [telephone, setTelephone] = useState()
  const [currentState, setCurrentState] = useState("Sign up");

  const [forgotPassword, setForgotPassword] = useState(false)

  const navigate = useNavigate()

  const onSubmitHandle = async (e) => {
    e.preventDefault();

    if (forgotPassword) {
      try {
        const response = await axios.post(`${backendUrl}/api/auth/forgot-password`, {email})
        toast.success("Password reset email sent successfully!")
        
        // Lấy token từ phản hồi của backend
        const resetToken = response.data.token // Lấy token từ dữ liệu phản hồi
        
        // Điều hướng đến trang Reset Password sau khi gửi email thành công
        navigate(`/reset-password/${resetToken}`);  // Điều hướng với token reset
        
        setForgotPassword(false); // Quay lại trạng thái Login

      } catch (error) {
        toast.error("Failed to send password reset email")
      }
    } else {
      const url =
        currentState === "Login"
          ? `${backendUrl}/api/auth/login`
          : `${backendUrl}/api/auth/register`;
  
      const data =
        currentState === "Login"
          ? { email, password }
          : { name, telephone, email, password };
  
      try {
        const response = await axios.post(url, data);
        
        if (currentState === "Login") {
          // Khi login thành công, lưu token vào localStorage 
          localStorage.setItem("token", response.data.token)
          localStorage.setItem("userName", response.data.name)
          setUserName(response.data.name)       
          navigate("/")       
          window.location.reload();
  
        } else {
          toast.success("Registered successfully!")
          setCurrentState("Login")
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          if (error.response.data === "Email already exists") {
            toast.warn("This Email Already Exists")
          } else {
            toast.error("An error occurred")
          }
        } else {
          toast.error("An error occurred")
        }
        console.log(error);
      }
    }
  };
  
  return (
    <form  responsive={Responsive}
      onSubmit={onSubmitHandle}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto my-14 gap-4 text-gray-400 "
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="text-3xl ">{forgotPassword ? "Forgot Password" : currentState}</p>
        <hr className="border-none h-[1.5px] w-9 bg-white" />
      </div>

    {/* Hiển thị chỉ khi Forgot Password */}
      {forgotPassword && (
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Email"
          required
        />
      )}

    {/* Hiển thị đăng nhập/đăng ký */}
    {!forgotPassword && (
      <>
      {currentState === "Sign up" && (
        <>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Name"
          required
        />
        <input
          type="tel"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Phone"
          required
        />
        </>
      )}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-3 py-2 border border-gray-800 "
        placeholder="Password"
        required
      />
    </>
    )}

      <div className="w-full flex justify-between text-sm mt-[-8px]">
      {!forgotPassword ? (
          <>
        <p className="cursor-pointer hover:text-yellow-50" onClick={() => setForgotPassword(true)}>Forgot your password?</p>

        {currentState === "Login" ? (
          <p
            className="cursor-pointer hover:text-yellow-50"
            onClick={() => setCurrentState("Sign up")}
          >
            Create account
          </p>
        ) : (
          <p
            className="cursor-pointer hover:text-yellow-50"
            onClick={() => setCurrentState("Login")}
          >
            Login Here
          </p>
        )}
      </>
      ) : (
        <p
            className="cursor-pointer hover:text-yellow-50"
            onClick={() => setForgotPassword(false)} // Quay lại trạng thái Login
          >
            Back to Login
          </p>
        )}
      
      </div>

      <button type="sumbit" className="bg-white text-black font-light px-8 py-2 mt-4 hover:bg-red-500">
        {forgotPassword ? "Reset Password" : currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};

export default Login;
