import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import { backendUrl } from "../App";

const CreateCeleb = () => {
  const [celeb, setCeleb] = useState({
    celebName: "",
    celebRole: "",
    celebImage: null,
    celebImageUrl: "",
    movieId: "",
  });

  const [imagePreview, setImagePreview] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCeleb({ ...celeb, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCeleb({ ...celeb, celebImage: file });

      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (image) => {
    try {
      const formData = new FormData();
      formData.append("myimage", image);

      const response = await axios.post(`${backendUrl}/image/uploadimage`,
        formData
      );

      if (response.data.ok) {
        return response.data.imageUrl; // Return the uploaded image URL
      } else {
        toast.error("Failed to upload the image");
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleAddCeleb = async () => {
    try {
      if (!celeb.celebName || !celeb.celebRole || !celeb.movieId) {
        toast.error("Please fill all the required fields");
        return;
      }

      let celebImageUrl = celeb.celebImageUrl;

      // Upload image if a file is selected
      if (celeb.celebImage) {
        celebImageUrl = await uploadImage(celeb.celebImage);
        if (!celebImageUrl) {
          toast.error("Failed to upload celeb image");
          return;
        }
      }

      const newCeleb = {
        celebName: celeb.celebName,
        celebRole: celeb.celebRole,
        celebImage: celebImageUrl,
        movieId: celeb.movieId,
      };

      const response = await axios.post(`${backendUrl}/api/movie/addceleb`, 
        newCeleb,
        {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.ok) {
        toast.success("Celebrity added successfully!");
        setCeleb({
          celebName: "",
          celebRole: "",
          celebImage: null,
          celebImageUrl: "",
          movieId: "",
        });
        setImagePreview("");
      } else {
        toast.error("Failed to add celebrity");
      }
    } catch (error) {
      console.error("Error adding celebrity:", error);
      toast.error("An error occurred");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-md">
      <h1 className="text-2xl font-semibold mb-4">Add Celebrity to Movie</h1>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block mb-1 font-medium">Celebrity Name</label>
          <input
            type="text"
            name="celebName"
            placeholder="Enter celebrity name"
            value={celeb.celebName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Role in Movie</label>
          <input
            type="text"
            name="celebRole"
            placeholder="Enter role (e.g., Actor, Director)"
            value={celeb.celebRole}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Movie ID</label>
          <input
            type="text"
            name="movieId"
            placeholder="Enter movie ID"
            value={celeb.movieId}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Celebrity Image</label>
          <label
            htmlFor="imageUpload"
            className="block cursor-pointer border-dashed border-2 rounded-md p-4 text-center"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover mx-auto"
              />
            ) : (
              "Click to upload image"
            )}
            <input
              type="file"
              id="imageUpload"
              hidden
              onChange={handleImageChange}
            />
          </label>
        </div>

        <div className="mt-4">
          <button
            onClick={handleAddCeleb}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Add Celebrity
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCeleb;
