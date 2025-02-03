import express from "express"
import {adminLogin, adminRegister} from "../controllers/adminController.js"

const Router = express.Router()

Router.route("/register").post(adminRegister)
Router.route("/login").post(adminLogin)

export default Router