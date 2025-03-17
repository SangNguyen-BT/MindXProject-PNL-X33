import express from "express";

import {
  addCelebToMovie,
  addMovieScheduleToScreen,
  bookTicket,
  createMovie,
  createScreen,
  getAllBookings,
  getAvailableDates,
  getMovieBySearch,
  getMovies,
  getMoviesId,
  getOnShowingMovies,
  getScheduleByMovies,
  getSchedules,
  getScreensByCity,
  getScreensByMoviesSchedule,
  getUpcomingMovies,
  getUserBookings,
  removeBooking,
  removeMovie,
  removeSchedule,
  removeScreen,
  updateMovie,
  updateSchedule,
  updateScreen,
} from "../controllers/movieController.js";

import authAdminToken from "../middleware/checkAdminToken.js";
import authToken from "../middleware/checkAuthToken.js";

const Router = express.Router();

{
  /* ADMIN ACCESS */
}
Router.route("/movieschedules").get(getSchedules);
Router.route("/getbookings").get(authAdminToken, getAllBookings)
Router.route("/screensbycity/:city").get(getScreensByCity);

Router.route("/createmovie").post(authAdminToken, createMovie);
Router.route("/createscreen").post(authAdminToken, createScreen);
Router.route("/removemovie").post(authAdminToken, removeMovie);
Router.route("/removescreen").post(authAdminToken, removeScreen);
Router.route("/addmoviescheduletoscreen").post(
  authAdminToken,
  addMovieScheduleToScreen
);
Router.route("/addceleb").post(authAdminToken, addCelebToMovie);

Router.route("/updatemovie/:id").put(authAdminToken, updateMovie);
Router.route("/updatescreen/:id").put(authAdminToken, updateScreen);
Router.route("/screens/:screenId/movie-schedules/:scheduleId")
  .put(authAdminToken, updateSchedule)
  .delete(authAdminToken, removeSchedule);

{
  /* USER ACCESS */
}
Router.route("/bookticket").post(authToken, bookTicket);

Router.route("/onshowing").get(getOnShowingMovies)
Router.route("/upcoming").get(getUpcomingMovies)
Router.route("/movies").get(getMovies);
Router.route("/movies/:id").get(getMoviesId);
Router.route("/screensbymovieschedule/:city/:date/:movieid").get(
  getScreensByMoviesSchedule
);
Router.route("/schedulebymovie/:screenid/:date/:movieid").get(
  getScheduleByMovies
);
Router.route("/getuserbookings").get(authToken, getUserBookings);
Router.route("/getavailabledates/:city/:movieid").get(getAvailableDates);
// Router.route("/search/:keyword").get(authToken, getMovieBySearch)
Router.route("/search/:keyword").get(getMovieBySearch)
Router.route("/removebooking/:bookingId").delete(authToken, removeBooking)

export default Router;
