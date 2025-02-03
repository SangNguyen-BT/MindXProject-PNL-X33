import express from "express";
import dotenv from "dotenv";
import cors from "cors"

import connectDB from "./config/mongodb.js"

import accountRoute from "./routes/accountRoute.js"
import movieRoute from "./routes/movieRoute.js"
import adminRoute from "./routes/adminRoute.js"
import imageRoute from "./routes/imageRoute.js"

// App Config
dotenv.config();
connectDB()
const app = express();

// middleware
// Dùng CORS để FE có thể gửi api đến BE thông qua method
const allowedOrigins = process.env.FRONTEND_URL.split(",")

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true
}))
app.use(express.json());

// api endpoints
app.use("/api/auth", accountRoute)
app.use("/admin", adminRoute)
app.use("/api/movie", movieRoute)
app.use("/image", imageRoute)

app.get("/", (req, res) => {
  res.send("API Working")
})

app.listen(8080, () => {
  console.log("Server is running");
});
