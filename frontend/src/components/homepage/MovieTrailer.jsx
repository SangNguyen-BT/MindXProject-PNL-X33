import React from "react";
import Modal from "react-modal";
import YouTube from "react-youtube";
import { Link } from "react-router-dom";

const MovieTrailerPopUp = (props) => {
  const {
    trailerKey,
    modalIsOpen,
    selectMovie,
    setModalIsOpen,
    handleClickBtnDetail,
  } = props;
  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={() => setModalIsOpen(false)}
      ariaHideApp={false}
      style={{
        overlay: {
          position: "fixed",
          zIndex: "9999",
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#161616",
          borderRadius: "10px",
        },
      }}
      contentLabel="Example Modal"
    >
      <YouTube videoId={trailerKey} opts={opts} />
      <div className="flex flex-col gap-3 text-white mt-3 w-[640px]">
        <h1 className="font-mono text-3xl">
          {" "}
          {selectMovie.title || selectMovie.original_title}
        </h1>
        <p className="text-yellow-400">
          Rating: {Number(selectMovie.vote_average).toFixed(1)}/10{" "}
          <i className="fa fa-star"></i>{" "}
        </p>
        <p className="text-wrap line-clamp-3">{selectMovie.overview}</p>
      </div>
      <div className="flex justify-end my-5">
        <Link to={`/${selectMovie.id}`}>
          <button
            onClick={() => handleClickBtnDetail()}
            className="p-2 rounded-md text-white bg-red-600 hover:cursor-pointer hover:bg-red-700 text-xl transition-all duration-200"
          >
            Chi tiết <i className="fa fa-arrow-right"></i>
          </button>
        </Link>
      </div>
    </Modal>
  );
};

export default MovieTrailerPopUp;
