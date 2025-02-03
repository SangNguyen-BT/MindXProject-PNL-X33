import express from "express"
import { changeCity, checkLogin, forgotPassword, getUser, login, register, resetPassword } from "../controllers/accountController.js"
import authToken from "../middleware/checkAuthToken.js"


const Router = express.Router()

Router.route("/register").post(register)
Router.route("/login").post(login)
Router.route("/forgot-password").post(forgotPassword)
Router.route("/reset-password").post(resetPassword)

Router.route("/getuser").get(authToken, getUser)
Router.route("/checklogin").get(authToken, checkLogin)

Router.route("/changecity").post(authToken, changeCity)

export default Router