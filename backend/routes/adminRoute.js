import express from "express"
import {adminLogin, adminRegister, getUser, sendNotification} from "../controllers/adminController.js"

const Router = express.Router()

Router.route("/register").post(adminRegister)
Router.route("/login").post(adminLogin)
Router.route("/send-notification").post(sendNotification)

Router.route("/getusers").get(getUser)

export default Router