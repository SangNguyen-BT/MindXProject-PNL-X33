import crypto from "crypto";
import axios from "axios";
import PaymentModel from "../model/Payment.js";
import MomoConfig from "../config/MomoConfig.js";

export const createPayment = async (req, res) => {
  try {
    const { amount, orderInfo, userId, bookingId } = req.body;

    if (!amount  || !userId || !bookingId) {
      return res.status(400).json({ message: "Thiếu thông tin thanh toán!" });
    }

    // Chuyển đổi USD -> VND (nếu cần)
    const amountVND = Math.round(amount * 24000); 

    // Kiểm tra số tiền hợp lệ
    if (amountVND < 1000 || amountVND > 50000000) {
      return res.status(400).json({ 
        message: "Số tiền giao dịch phải từ 1,000 VND đến 50,000,000 VND.", 
        amountVND 
      });
    }

    const requestId = `${MomoConfig.partnerCode}_${Date.now()}`;
    const orderId = requestId;
    const extraData = "";

    const rawSignature = 
      `accessKey=${MomoConfig.accessKey}&amount=${amountVND}&extraData=${extraData}` +
      `&ipnUrl=${MomoConfig.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}` +
      `&partnerCode=${MomoConfig.partnerCode}&redirectUrl=${MomoConfig.redirectUrl}` +
      `&requestId=${requestId}&requestType=captureWallet`;

    const signature = crypto.createHmac("sha256", MomoConfig.secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = {
      partnerCode: MomoConfig.partnerCode,
      accessKey: MomoConfig.accessKey,
      requestId,
      amount: amountVND,
      orderId,
      orderInfo,
      redirectUrl: MomoConfig.redirectUrl,
      ipnUrl: MomoConfig.ipnUrl,
      requestType: "captureWallet",
      extraData,
      signature,
      lang: "vi",
    }

    const momoResponse = await axios.post(MomoConfig.endpoint, requestBody, {
      headers: { "Content-Type": "application/json" },
    });

    if (momoResponse.data && momoResponse.data.payUrl) {
      await PaymentModel.create({
        orderId,
        requestId,
        userId,
        bookingId,
        amount: amountVND,
        paymentType: "MOMO",
        status: "PENDING",
      });

      return res.json({
        message: "Tạo thanh toán thành công",
        payUrl: momoResponse.data.payUrl,
      });
    } else {
      return res.status(500).json({ message: "Thanh toán thất bại", data: momoResponse.data });
    }
  } catch (error) {
    console.error("Lỗi thanh toán:", error);
    return res.status(500).json({ message: "Thanh toán thất bại. Vui lòng thử lại.", error: error.message });
  }
};

