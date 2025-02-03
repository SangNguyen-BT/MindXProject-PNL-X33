import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import AdminModel from "../model/Admin.js";

export const adminRegister = async (req, res, next) => {
  try {
    const { name, email, password} = req.body;

    if (!name || !email || !password)
      return res.status(401).json("Require name, email, password");

    const existedAdmin = await AdminModel.findOne({ email });
    if (existedAdmin) return res.status(400).json("This Email is already registered");

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newAdmin = await AdminModel.create({
      name,
      email,
      password: hash
    });

    res.status(201).send({
      message: "Register successfully",
      newAdmin,
      success: true,
    });

  } catch (error) {
    res.status(403).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await AdminModel.findOne({ email });
    if (!admin) return res.status(404).json("Invalid Email or Password");

    // So sánh mật khẩu người dùng nhập với mật khẩu đã hash trong cơ sở dữ liệu
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json("Invalid password");

    const adminAuthToken = jwt.sign({ adminId: admin._id }, process.env.ADMIN_SECRET_KEY, {expiresIn: "1h"});

    res.status(201).send({
      message: "Login successfully",
      adminAuthToken, 
      name: admin.name,
      success: true,
    });

  } catch (error) {
    res.status(403).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
};
