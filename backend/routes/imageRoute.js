import express from "express"
import upload from "../middleware/multer.js"
import uploadImage from "../controllers/imageController.js"

const Router = express.Router()

Router.route("/uploadimage").post(upload.single("myimage"), uploadImage) 

export default Router