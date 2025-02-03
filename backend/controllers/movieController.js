import MovieModel from "../model/Movie.js";
import ScreenModel from "../model/Screen.js";
import AccountModel from "../model/Account.js";
import BookingModel from "../model/Booking.js";

/* ADMIN ACCESS */

export const createMovie = async (req, res, next) => {
  try {
    const {
      title,
      description,
      portraitImgUrl,
      landscapeImgUrl,
      rating,
      genre,
      duration,
    } = req.body;

    const newMovie = new MovieModel({
      title,
      description,
      portraitImgUrl,
      landscapeImgUrl,
      rating,
      genre,
      duration,
    });
    await newMovie.save();

    res.status(201).json({
      ok: true,
      message: "Movie added successfully",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const removeMovie = async (req, res, next) => {
  try {
    await MovieModel.findByIdAndDelete(req.body.id);

    res.status(201).json({
      ok: true,
      message: "Movie removed",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedMovie = await MovieModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedMovie) {
      return res.status(404).json({ ok: false, message: "Movie not found" });
    }

    res.status(200).json({
      ok: true,
      message: "Movie updated successfully",
      data: updatedMovie,
    });
  } catch (error) {
    res.json({ ok: false, message: error.message });
  }
};

export const addCelebToMovie = async (req, res, next) => {
  try {
    const { movieId, celebName, celebRole, celebImage } = req.body;
    const movie = await MovieModel.findById(movieId);

    if (!movie) {
      return res.status(404).json({
        ok: false,
        message: "Movie not found",
      });
    }
    const newCeleb = {
      celebName,
      celebRole,
      celebImage,
    };

    movie.cast.push(newCeleb);

    await movie.save();

    res.status(201).json({
      ok: true,
      message: "Celeb added successfully",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const createScreen = async (req, res, next) => {
  try {
    const { name, location, seats, city, screenType } = req.body;

    const newScreen = new ScreenModel({
      name,
      location,
      seats,
      city: city,
      screenType,
      movieSchedules: [],
    });

    await newScreen.save();

    res.status(201).json({
      ok: true,
      message: "Screen added successfully",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const addMovieScheduleToScreen = async (req, res, next) => {
  try {
    const { screenId, movieId, movieName, showTime, showDate } = req.body;

    const screen = await ScreenModel.findById(screenId);
    if (!screen) {
      return res.status(404).json({
        ok: false,
        message: "Screen not found",
      });
    }

    const movie = await MovieModel.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        ok: false,
        message: "Movie not found",
      });
    }

    screen.movieSchedules.push({
      movieId,
      movieName,
      showTime,
      notavailableseats: [],
      showDate,
    });

    await screen.save();

    res.status(201).json({
      ok: true,
      message: "Movie schedule added successfully",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const removeScreen = async (req, res, next) => {
  try {
    await ScreenModel.findByIdAndDelete(req.body.id);

    res.status(200).json({ ok: true, message: "Cinema removed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateScreen = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedScreen = await ScreenModel.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!updatedScreen) {
      return res.status(404).json({ ok: false, message: "Screen not found" });
    }

    res.status(200).json({
      ok: true,
      message: "Screen updated successfully",
      data: updatedScreen,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getSchedules = async (req, res, next) => {
  try {
    const screens = await ScreenModel.find({})
      .select("name location screenType movieSchedules")
      .populate("movieSchedules.movieId", "movieName");

    const allSchedules = screens.reduce((acc, screen) => {
      // Thêm thông tin màn hình vào mỗi lịch chiếu
      const screenSchedules = screen.movieSchedules.map((schedule) => ({
        ...schedule.toObject(),
        screenId: screen._id,
        screenName: screen.name,
        screenLocation: screen.location,
        screenType: screen.screenType,
      }));
      return acc.concat(screenSchedules);
    }, []);

    res.status(200).json({
      ok: true,
      message: "Movie schedules fetched successfully",
      data: allSchedules,
    });
  } catch (error) {
    console.error("Error fetching movie schedules:", error.message);
    res.status(500).json({ ok: false, message: error.message });
  }
};

export const updateSchedule = async (req, res, next) => {
  try {
    const { screenId, scheduleId } = req.params;
    const updatedSchedule = req.body;

    const screen = await ScreenModel.findById(screenId);
    if (!screen) {
      return res.status(404).json({ message: "Screen not found" });
    }

    const scheduleIndex = screen.movieSchedules.findIndex(
      (schedule) => schedule._id.toString() === scheduleId
    );
    if (scheduleIndex === -1) {
      return res.status(404).json({ message: "Movie schedule not found" });
    }

    const scheduleToUpdate = screen.movieSchedules[scheduleIndex];

    const updatedScheduleData = {
      ...scheduleToUpdate, 
      ...updatedSchedule,
    };
    
    updatedScheduleData.movieId = scheduleToUpdate.movieId;

    // Cập nhật lại phần unavailable seats
    screen.movieSchedules[scheduleIndex].notAvailableSeats =
      updatedSchedule.notAvailableSeats;

    // Cập nhật lại schedule trong movieSchedules
    screen.movieSchedules[scheduleIndex] = updatedScheduleData;

    const bookings = await BookingModel.find({
      screenId,
      showTime: scheduleToUpdate.showTime,
      showDate: scheduleToUpdate.showDate,
    });

    for (const booking of bookings) {
      booking.showTime = updatedSchedule.showTime 
      booking.showDate = updatedSchedule.showDate 
      booking.movieTitle = updatedSchedule.movieName 
      booking.screenName = screen.name 
      booking.seats = updatedSchedule.notAvailableSeats;

      booking.seats = booking.seats.map((seat) => {
        const updatedSeat = updatedSchedule.notAvailableSeats.find(
          (updated) => updated.seat_id === seat.seat_id
        );
        if (updatedSeat) {
          return {
            ...seat,
            price: updatedSeat.price, 
          };
        }
        return seat;
      });

      // Tính lại tổng giá `totalPrice` từ giá từng ghế
      booking.totalPrice = booking.seats.reduce((sum, seat) => sum + seat.price, 0);

      await booking.save();
    }

    await screen.save();

    res.json({ ok: true, message: "Schedule updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const removeSchedule = async (req, res, next) => {
  try {
    const { screenId, scheduleId } = req.params;

    const screen = await ScreenModel.findById(screenId);
    if (!screen) return res.status(404).json({ error: "Screen not found" });

    const scheduleIndex = screen.movieSchedules.findIndex(
      (schedule) => schedule._id.toString() === scheduleId
    );
    if (scheduleIndex === -1) {
      return res.status(404).json({ message: "Movie schedule not found" });
    }

    screen.movieSchedules.splice(scheduleIndex, 1);

    await screen.save();

    res.json({ ok: true, message: "Schedule deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await BookingModel.find()
      .populate("userId", "name email") 
      .populate("screenId", "name location") 

    res.status(200).json({
      ok: true,
      message: "Bookings retrieved successfully",
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

export const getScreensByCity = async (req, res, next) => {
  //:city
  const city = req.params.city;

  try {
    const screens = await ScreenModel.find({ city });
    if (!screens || screens.length === 0) {
      return res.status(404).json("No screens found in the specified city");
    }

    res.status(200).json({
      ok: true,
      data: screens,
      message: "Cinemas retrieved successfully",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* USER ACCESS */

export const bookTicket = async (req, res, next) => {
  try {
    const {
      showTime,
      showDate,
      movieId,
      screenId,
      seats,
      totalPrice,
      paymentId,
      paymentType,
    } = req.body;

    const screen = await ScreenModel.findById(screenId);
    if (!screen) {
      return res.status(404).json({
        ok: false,
        message: "Cinema not found",
      });
    }

    const movieSchedule = screen.movieSchedules.find((schedule) => {
      let showDate1 = new Date(schedule.showDate);
      let showDate2 = new Date(showDate);
      if (
        showDate1.getDay() === showDate2.getDay() &&
        showDate1.getMonth() === showDate2.getMonth() &&
        showDate1.getFullYear() === showDate2.getFullYear() &&
        schedule.showTime === showTime &&
        schedule.movieId == movieId
      ) {
        return true;
      }
      return false;
    });

    if (!movieSchedule) {
      return res.status(404).json({
        ok: false,
        message: "Movie schedule not found",
      });
    }

    const user = await AccountModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "User not found",
      });
    }

    const movie = await MovieModel.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        ok: false,
        message: "Movie not found",
      });
    }

    const newBooking = new BookingModel({
      userId: req.userId,
      movieId,
      screenId,
      userName: user.name,
      movieTitle: movie.title,
      screenName: screen.name,
      showTime,
      showDate,
      seats,
      totalPrice,
      paymentId,
      paymentType,
    });
    await newBooking.save();

    movieSchedule.notAvailableSeats.push(...seats);
    await screen.save();

    user.bookings.push(newBooking);
    await user.save();

    res.status(201).json({
      ok: true,
      message: "Booking successful",
      data: newBooking,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getMovies = async (req, res, next) => {
  try {
    const movies = await MovieModel.find();

    res.status(200).json({
      ok: true,
      data: movies,
      message: "Movies retrieved successfully",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getMoviesId = async (req, res, next) => {
  try {
    const movieId = req.params.id;

    const movie = await MovieModel.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        ok: false,
        message: "Movie not found",
      });
    }

    res.status(200).json({
      ok: true,
      data: movie,
      message: "Movie retrieved successfully",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getScreensByMoviesSchedule = async (req, res, next) => {
  // /:city/:date/:movieid
  try {
    const city = req.params.city;
    const date = req.params.date;
    const movieId = req.params.movieid;

    // Retrieve screens for the specified city
    const screens = await ScreenModel.find({ city });
    if (!screens || screens.length === 0) {
      return res.status(404).json("No screens found in the specified city");
    }

    let temp = [];
    // Filter screens based on the showDate
    const filteredScreens = screens.forEach((screen) => {
      screen.movieSchedules.forEach((schedule) => {
        let showDate = new Date(schedule.showDate);
        let bodyDate = new Date(date);
        // console.log(showDate , bodyDate);
        if (
          showDate.getDay() === bodyDate.getDay() &&
          showDate.getMonth() === bodyDate.getMonth() &&
          showDate.getFullYear() === bodyDate.getFullYear() &&
          schedule.movieId == movieId
        ) {
          // Make sure screenId is included in the response
          if (!temp.some((s) => s._id.toString() === screen._id.toString())) {
            temp.push(screen); 
          }
        }
      });
    });

    res.status(200).json({
      ok: true,
      data: temp,
      message: "Screens retrieved successfully",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getScheduleByMovies = async (req, res, next) => {
  // /:screenid/:date/:movieid
  const screenId = req.params.screenid;
  const date = req.params.date;
  const movieId = req.params.movieid;

  const screen = await ScreenModel.findById(screenId);
  if (!screen) {
    return res.status(404).json("Screen not found");
  }

  const movieSchedules = screen.movieSchedules.filter((schedule) => {
    let showDate = new Date(schedule.showDate);
    let bodyDate = new Date(date);
    if (
      showDate.getDay() === bodyDate.getDay() &&
      showDate.getMonth() === bodyDate.getMonth() &&
      showDate.getFullYear() === bodyDate.getFullYear() &&
      schedule.movieId == movieId
    ) {
      return true;
    }
    return false;
  });

  if (!movieSchedules) {
    return res.status(404).json("Movie schedule not found");
  }

  res.status(200).json({
    ok: true,
    message: "Movie schedule retrieved successfully",
    data: {
      screen,
      movieSchedulesforDate: movieSchedules,
    },
  });
};

export const getUserBookings = async (req, res, next) => {
  try {
    const user = await AccountModel.findById(req.userId).populate("bookings");
    if (!user) {
      return res.status(404).json("User not found");
    }

    let bookings = [];

    for (let i = 0; i < user.bookings.length; i++) {
      let bookingObj = await BookingModel.findById(user.bookings[i]._id).populate("screenId", "name location");
      bookings.push(bookingObj);
    }

    res.status(200).json({
      ok: true,
      message: "User bookings retrieved successfully",
      data: bookings,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAvailableDates = async (req, res, next) => {
  try {
    const city = req.params.city;
    const movieId = req.params.movieid;

    // Find all the schedules for movieId and city
    const screens = await ScreenModel.find({ city }).populate("movieSchedules");

    let availableDates = [];

    screens.forEach((screen) => {
      screen.movieSchedules.forEach((schedule) => {
        if (schedule.movieId.toString() === movieId) {
          const showDate = schedule.showDate.toISOString().split("T")[0]; // Get only the date part (e.g., "2023-12-23")
          if (!availableDates.includes(showDate)) {
            availableDates.push(showDate);
          }
        }
      });
    });

    return res.json({ ok: true, data: availableDates });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Failed to fetch available dates" });
  }
};

export const getMovieBySearch = async (req, res, next) => {
  try {
    const { keyword } = req.params;

    const movies = await MovieModel.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } }, 
        { description: { $regex: keyword, $options: "i" } }, 
        { genre: { $regex: keyword, $options: "i" } }, 
      ],
    });

    if (movies.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "No movies found with that keyword",
      });
    }

    res.status(200).json({
      ok: true,
      message: "Movies retrieved successfully",
      data: movies,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
