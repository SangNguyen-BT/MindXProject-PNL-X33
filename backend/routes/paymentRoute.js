import express from "express";
import { createPayment} from "../controllers/MomoController.js";


const Router = express.Router();

Router.route("/createPayment").post(createPayment);

export default Router;
