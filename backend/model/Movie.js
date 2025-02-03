import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: String,
  description: String,
  portraitImgUrl: String,
  landscapeImgUrl: String,
  rating: Number,
  genre: [String], 
  duration: Number, 
  cast: [
    {
      celebName: String,
      celebRole: String,
      celebImage: String,
    },
  ],
});

const MovieModel = mongoose.model("movies", movieSchema);

export default MovieModel;
