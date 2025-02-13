import React, { useEffect } from "react";

const ScrollTopTop = () => {
  useEffect(() => {
    const scrollFunction = () => {
      const button = document.getElementById("myBtn");
      if (!button) return;

      if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
      ) {
        button.style.display = "inline-block";
      } else {
        button.style.display = "none";
      }
    };

    window.onscroll = scrollFunction;

    return () => {
      window.onscroll = null;
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <button
        id="myBtn"
        className="fixed bottom-2 right-2 rounded-md bg-red-500 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md  hover:bg-red-700 active:shadow-none hover:cursor-pointer ml-2 z-50"
        type="button"
        onClick={handleScrollToTop}
        style={{ display: "none" }}
      >
        <i className="fa fa-angle-double-up"></i>
      </button>
    </>
  );
};

export default ScrollTopTop;
