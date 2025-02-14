import React from "react";
import { useNavigate } from "react-router-dom";

const BackToPrePage = () => {
  const navigate = useNavigate();
  const handleBackPrePage = () => {
    navigate('/');
  };
  return (
    <button
      className="fixed block bottom-2 left-2 rounded-md bg-red-500 py-2 px-4 border border-transparent 
      text-center text-sm text-white transition-all shadow-md  
      hover:bg-red-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2 z-50"
      type="button"
      onClick={() => handleBackPrePage()}
    >
     <i className="fa fa-angle-left"></i> Back
    </button>
  );
};

export default BackToPrePage;
