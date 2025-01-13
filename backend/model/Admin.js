import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
},{timestamps: true});

const AdminModel = mongoose.model("admin", adminSchema)

export default AdminModel