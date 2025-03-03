import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import AccountModel from "../model/Account.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(401).json("Require name, email, password");

    const existedAccount = await AccountModel.findOne({ email });
    if (existedAccount) return res.status(400).json("Email already exists");

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newAccount = await AccountModel.create({
      name,
      email,
      password: hash,
      city: "HCM",
    });

    res.status(201).send({
      message: "Register successfully",
      newAccount,
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

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const account = await AccountModel.findOne({ email });
    if (!account) return res.status(404).json("Invalid Email or Password");

    // So sánh mật khẩu người dùng nhập với mật khẩu đã hash trong cơ sở dữ liệu
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) return res.status(400).json("Invalid password");

    const token = jwt.sign({ userId: account._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(201).send({
      message: "Login successfully",
      token,
      name: account.name,
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

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await AccountModel.findOne({ email });
    if (!user) return res.status(400).json("User not found");

    // Tạo JWT làm token reset password
    const resetToken = jwt.sign({ email: user.email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    // Gửi token qua email
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // Cấu hình transporter Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Gửi email bằng Nodemailer
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
    };

    await transporter.sendMail(mailOptions); // Gửi Email

    res.status(200).json({
      message: "Password reset email sent successfully.",
      token: resetToken,
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    // Xác minh token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Tìm user theo email trong token
    const user = await AccountModel.findOne({ email: decoded.email });
    if (!user) return res.status(404).json("User not found");

    // Tìm user và cập nhật mật khẩu mới
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    // Cập nhật mật khẩu trong DB
    user.password = hashedPassword;
    await user.save();

    res.status(200).json("Password reset successfully.");
  } catch (error) {
    res.status(400).json("Invalid or expired token.");
  }
};

export const getUser = async (req, res, next) => {
  const user = await AccountModel.findOne({ _id: req.userId });

  if (!user) {
    return res.status(400).json({ ok: false, message: "Invalid credentials" });
  } else {
    return res
      .status(200)
      .json({ ok: true, message: "User found", data: user });
  }
};

export const checkLogin = async (req, res, next) => {
  res.json({
    userId: req.userId,
    ok: true,
    message: "User authenticated successfully",
  });
};

export const changeCity = async (req, res, next) => {
  const { city } = req.body;

  const user = await AccountModel.findOne({ _id: req.userId });
  if (!user) {
    return res.status(400).json({ ok: false, message: "Invalid credentials" });
  } else {
    user.city = city;
    await user.save();
    return res
      .status(200)
      .json({ ok: true, message: "City changed successfully", city });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, city } = req.body;

    const updatedUser = await AccountModel.findByIdAndUpdate(
      id,
      { name, email, city },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: "Không tìm thấy tài khoản." });

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const changeUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const account = await AccountModel.findById(id);
    if (!account) return res.status(404).json({ error: "Tài khoản không tồn tại." });

    // Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, account.password);
    if (!isMatch) return res.status(400).json({ error: "Mật khẩu cũ không đúng." });

    // Kiểm tra xác nhận mật khẩu
    if (newPassword !== confirmPassword) return res.status(400).json({ error: "Mật khẩu xác nhận không khớp." });

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    account.password = hashedPassword;
    await account.save();

    res.json({ message: "Đổi mật khẩu thành công." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};