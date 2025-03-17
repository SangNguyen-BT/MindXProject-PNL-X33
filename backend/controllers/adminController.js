import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import AdminModel from "../model/Admin.js";
import AccountModel from "../model/Account.js";
import sendEmail from "../utils/email.js";

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

export const getUser = async (req, res, next) => {
  const user = await AccountModel.find();

  if (!user) {
    return res.status(400).json({ ok: false, message: "Invalid credentials" });
  } else {
    return res
      .status(200)
      .json({ ok: true, message: "User found", data: user });
  }
};

export const sendNotification = async (req, res, next) => {
  try {
    const { subject, message, userIds } = req.body;

    // Lấy danh sách email từ userIds
    const users = await AccountModel.find({ _id: { $in: userIds } }, "email");
    const emails = users.map((user) => user.email);

    if (emails.length === 0) {
      return res.status(400).json({ message: "User invalid" });
    }

    // Gửi email hàng loạt
    for (const email of emails) {
      await sendEmail(email, subject, message, `<p>${message}</p>`);
    }

    res.status(200).json({ message: "Notification sent successfully" });
  } catch (error) {
    console.error("Error sending:", error);
    res.status(500).json({ message: "Error sending" });
  }
}