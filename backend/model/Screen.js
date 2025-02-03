import mongoose from "mongoose";

const screenSchema = new mongoose.Schema({
  name: String,
  location: String,
  seats: Array,
  city: String,
  screenType: String, 
  movieSchedules: [
    {
      movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "movies", 
      },
      movieName: String,
      showTime: String,
      notAvailableSeats: [
        {
          row: String,
          col: Number,
          seat_id: String,
          price: Number,
        },
      ],
      showDate: Date,
    },
  ],
});

const ScreenModel = mongoose.model("screens", screenSchema)

export default ScreenModel