import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { backendUrl } from "../App";
import image from "../assets/noteicon.jpg";
import CreateMoviePage from "../components/CreateMovie";

const ListMovies = () => {
  const [list, setList] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null); // Movie being edited
  const [updatedMovie, setUpdatedMovie] = useState({});
  const [newPortraitImg, setNewPortraitImg] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0);

  const genres = [
    "Action",
    "Comedy",
    "Drama",
    "Fantasy",
    "Horror",
    "Science",
    "Thriller",
    "Cartoon",
    "Other",
  ];

  const fetchList = async (page) => {
    try {
      const response = await axios.get(`${backendUrl}/api/movie/movies`, {
        params: {
          page: page,
          limit: 5,
        },
      });

      if (response.data.ok) {
        setList(response.data.dataAdmin);
        setTotalMovies(response.data.totalMovies);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeMovie = async (id) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/movie/removemovie`,
        { id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.ok) {
        toast.success(response.data.ok);

        await fetchList();
      } else {
        toast.error(response.data.ok);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  //* DRAWER ADD MOVIE *//

  const handleToggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  const onMovieAdded = () => {
    fetchList();
    setIsDrawerOpen(false);
  };

  ///* MODAL UPDATE *//

  const openModal = (movie) => {
    setCurrentMovie(movie);
    setUpdatedMovie(movie);
    setNewPortraitImg(null);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentMovie(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedMovie({ ...updatedMovie, [name]: value });
  };

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("myimage", file);

      const response = await axios.post(
        `${backendUrl}/image/uploadimage`,
        formData
      );
      if (response.data.ok) {
        return response.data.imageUrl; // Return the uploaded image URL
      } else {
        toast.error("Image upload failed");
        return null;
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Image upload failed");
      return null;
    }
  };

  const handleUpdate = async () => {
    try {
      let portraitImgUrl = updatedMovie.portraitImgUrl;

      if (newPortraitImg) {
        portraitImgUrl = await handleImageUpload(newPortraitImg);
        if (!portraitImgUrl) return;
      }

      const response = await axios.put(
        `${backendUrl}/api/movie/updatemovie/${currentMovie._id}`,
        { ...updatedMovie, portraitImgUrl },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.ok) {
        toast.success("Movie updated successfully!");
        closeModal();
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList(currentPage);
    window.scrollTo(0, 0);
  }, [currentPage]);

  const totalPages = Math.ceil(totalMovies / 5);

  // Hàm thay đổi trang
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center py-4 px-6 bg-gray-100">
        <h1 className="text-xl font-semibold">All Movies Available</h1>
        <div className="flex gap-3">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            onClick={handleToggleDrawer}
          >
            Add Movie
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            onClick={() => navigate("/create-celeb")}
          >
            Add Celeb
          </button>
        </div>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                No.
              </th>
              <th scope="col" className="px-6 py-3">
                Image
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Rating
              </th>
              <th scope="col" className="px-6 py-3">
                Genre
              </th>
              <th scope="col" className="px-6 py-3">
                Duration
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>

          {/* ---- Movie List ------ */}
          <tbody>
            {list.map((item, index) => {
              return (
                <tr
                  key={index}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <td className="px-6 py-4 font-medium text-white">
                    {index + 1} .
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <img
                      className="w-24"
                      src={item.portraitImgUrl}
                      alt={item.title}
                    />
                  </td>
                  <td className="px-6 py-4">{item.title}</td>
                  <td className="px-6 py-4">{item.rating}</td>

                  <td className="px-6 py-4">
                    {item.genre.map((genre, genreIndex) => (
                      <p key={genreIndex} className=" flex flex-col gap-1 ">
                        {genre}
                      </p>
                    ))}
                  </td>

                  <td className="px-6 py-4">{item.duration} (mins)</td>

                  <td className="px-6 py-[50%] flex flex-row gap-7">
                    <img
                      src={image}
                      className="cursor-pointer text-white hover:text-blue-700 w-5"
                      onClick={() => openModal(item)}
                    />
                    <span
                      className="cursor-pointer text-red-500 hover:text-red-700"
                      onClick={() => removeMovie(item._id)}
                    >
                      X
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Phân trang */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-500 text-white rounded-l-lg"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-500 text-white rounded-r-lg"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal for Editing Movie */}
      {modalIsOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-[90%] max-w-[500px]">
            <h3 className="text-xl font-semibold mb-4">Update Movie</h3>

            {/* Portrait Image Upload */}
            <div>
              <label className="block mb-1">Portrait Image</label>
              <input
                type="file"
                onChange={(e) => setNewPortraitImg(e.target.files[0])}
                className="w-full"
              />
            </div>

            {/* Show Image Preview */}
            {(newPortraitImg || updatedMovie.portraitImgUrl) && (
              <div className="mt-2">
                <img
                  src={
                    newPortraitImg
                      ? URL.createObjectURL(newPortraitImg)
                      : updatedMovie.portraitImgUrl
                  }
                  alt="Preview"
                  className="w-24 h-32 object-cover border rounded-md shadow-md mb-2"
                />
              </div>
            )}

            <div>
              <label className="block mb-1">Movie Name</label>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={updatedMovie.title}
                onChange={handleInputChange}
                className="w-full mb-2 p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block mb-1">Genre</label>
              <select
                multiple
                name="genre"
                value={updatedMovie.genre}
                onChange={(e) =>
                  setUpdatedMovie({
                    ...updatedMovie,
                    genre: Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    ),
                  })
                }
                className="w-full mb-2 p-2 border rounded-md"
              >
                {genres.map((genre, index) => (
                  <option key={index} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Rating</label>

              <input
                type="number"
                name="rating"
                placeholder="Rating"
                value={updatedMovie.rating}
                onChange={handleInputChange}
                className="w-full mb-2 p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block mb-1">Duration (minutes)</label>

              <input
                type="number"
                name="duration"
                placeholder="Duration"
                value={updatedMovie.duration}
                onChange={handleInputChange}
                className="w-full mb-2 p-2 border rounded-md"
              />
            </div>

            <div className="flex gap-4 justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-300 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Movie Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-[90%] max-w-[500px] h-full max-h-screen p-6 relative flex flex-col">
            <button
              className="absolute top-4 right-4 text-xl"
              onClick={handleToggleDrawer}
            >
              X
            </button>
            <h3 className="text-xl font-semibold mb-4">Add New Movie</h3>

            <div className="flex-1 overflow-y-auto pr-2">
              <CreateMoviePage onMovieAdded={onMovieAdded} genres={genres} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListMovies;
