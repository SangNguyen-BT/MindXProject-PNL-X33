import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import image from "../assets/upload.jpg";
import { backendUrl } from "../App";

const CreateMoviePage = ({onMovieAdded}) => {
  const [movie, setMovie] = useState({
    title: "",
    description: "",
    portraitImgUrl: "",
    portraitImg: null,
    landscapeImgUrl: "",
    landscapeImg: null,
    rating: 0,
    genre: [],
    duration: 0,
    category: "on_showing",
  });

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

  const [portraitImagePreview, setPortraitImagePreview] = useState("");
  const [landscapeImgPreview, setLandscapeImgPreview ] = useState("")

  const handlePortraitImageChange = (e) => {
    const file = e.target.files[0];
    if (e.target.files && e.target.files.length > 0) {
      setMovie({ ...movie, portraitImg: file });

      // Create a URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPortraitImagePreview(reader.result); // Set the preview image URL
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const handleLandscapeImageChange = (e) => {
    const file = e.target.files[0];
    if (e.target.files && e.target.files.length > 0) {
      setMovie({ ...movie, landscapeImg: file });

      // Create a URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setLandscapeImgPreview(reader.result); // Set the preview image URL
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const handleGenreChange = (genre) => {
    if (movie.genre.includes(genre)) {
      // unchecking
      setMovie({
        ...movie,
        genre: movie.genre.filter((selectedGenre) => selectedGenre !== genre),
      });
    } else {
      setMovie({ ...movie, genre: [...movie.genre, genre] });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMovie({ ...movie, [name]: value });
  };

  const uploadImage = async (image) => {
    try {
      const formData = new FormData();
      formData.append("myimage", image);

      const response = await axios.post(`${backendUrl}/image/uploadimage`,
        formData, 
        {
          headers: {'Content-Type': 'multipart/form-data'},
        },
      );

      if (response.data.ok) {
        console.log("Image uploaded successfully:", response.data);
        return response.data.imageUrl;
      } else {
        console.error("Failed to upload the image.");
        return null;
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  const handleCreateMovie = async () => {
    try {
      if (
        movie.title === "" ||
        movie.description === "" ||
        movie.rating === 0 ||
        movie.genre.length === 0 ||
        movie.duration === 0
      ) {
        toast.error("Please fill all the fields", {
          position: "top-center",
        });
        return;
      }

      let portraitImgUrl = movie.portraitImgUrl;
      let landscapeImgUrl = movie.landscapeImgUrl;

      // Lấy link khi up file hình ảnh
      if (movie.portraitImg) {
        portraitImgUrl = await uploadImage(movie.portraitImg);
        if (!portraitImgUrl) {
          toast.error("Portrait Image upload failed", {
            position: "top-center",
          });
          return;
        }
      }

      if (movie.landscapeImg) {
        landscapeImgUrl = await uploadImage(movie.landscapeImg);
        if (!landscapeImgUrl) {
          toast.error("Landscape Image upload failed", {
            position: "top-center",
          });
          return;
        }
      }

      const newMovie = { ...movie, portraitImgUrl, landscapeImgUrl };

      const response = await axios.post(
        `${backendUrl}/api/movie/createmovie`, 
        newMovie,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.ok) {
        console.log("Movie creation successful", response.data);

        onMovieAdded();
        
        toast.success("Movie Created Successfully", {
          position: "top-center",
        });
      } else {
        console.error("Movie creation failed", response.data.message);
        toast.error("Movie Creation Failed", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("An error occurred during movie creation", error);
    }
  };

  return (
    <form className="flex flex-col w-full items-start gap-3">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
        <div>
          <p>Portrait Image</p>

          <label htmlFor="image1">
            <img
              src={portraitImagePreview || image}
              alt="Selected Portrait"
              className="w-20 h-20 object-cover mx-auto"
            />
            <input
              type="file"
              hidden
              onChange={handlePortraitImageChange}
              id="image1"
            />
          </label>
        </div>

        <div>
          <p>Landscape Image</p>

          <label htmlFor="image2">
            <img
              src={landscapeImgPreview || image}
              alt=""
              className="w-20 h-20 object-cover mx-auto"
            />
            <input
              type="file"
              hidden
              onChange={handleLandscapeImageChange}
              id="image2"
            />
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Movie Title</p>
        <input
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          name="title"
          placeholder="Title"
          value={movie.title}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Movie Description</p>
        <textarea
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          name="description"
          placeholder="Write description here"
          value={movie.description}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Rating</p>
        <input
          className="w-full max-w-[200px] px-3 py-2 border rounded-md"
          min={0}
          type="number"
          name="rating"
          placeholder="Rating"
          value={movie.rating}
          onChange={handleInputChange}
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Select Genres:</p>
        <div className="flex flex-wrap gap-4">
          {genres.map((genre) => (
            <label key={genre} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="genre"
                checked={movie.genre.includes(genre)}
                onChange={() => handleGenreChange(genre)}
                className="accent-blue-500"
              />
              <span>{genre}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Duration (minutes)</p>
        <input
          className="w-full max-w-[200px] px-3 py-2 border rounded-md"
          type="number"
          name="duration"
          placeholder="Duration"
          value={movie.duration}
          onChange={handleInputChange}
        />
      </div>

      <div className="w-full">
  <p className="mb-2">Select Category:</p>
  <div className="flex gap-4">
    {["on_showing", "upcoming"].map((cate) => (
      <label key={cate} className="flex items-center gap-2">
        <input
          type="radio"
          name="category"
          value={cate}
          checked={movie.category === cate}
          onChange={handleInputChange}
          className="accent-blue-500"
        />
        <span>{cate.replace("_", " ").toUpperCase()}</span>
      </label>
    ))}
  </div>
</div>

      <div className="w-full text-center">
        <button
          type="button"
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
          onClick={handleCreateMovie}
        >
          Create Movie
        </button>
      </div>
    </form>
  );
};

export default CreateMoviePage;
