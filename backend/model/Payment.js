import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true }, 
  requestId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "accounts" }, 
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "bookings" }, 
  amount: { type: Number, required: true }, 
  paymentType: { type: String, enum: ["MOMO"], required: true },
  status: { type: String, enum: ["PENDING", "SUCCESS", "FAILED"], default: "PENDING" }, 
  transactionId: { type: String }, 
  createdAt: { type: Date, default: Date.now },
});

const PaymentModel = mongoose.model("payments", paymentSchema);
export default PaymentModel;
