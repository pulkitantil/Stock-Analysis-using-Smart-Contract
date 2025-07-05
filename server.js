const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

// Improved CORS configuration
app.use(cors({
  origin: 'http://localhost:5500', // or whatever port your frontend is on
  credentials: true
}));
app.use(express.json());

let currentOtp = "";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post("/send-otp", async (req, res) => {
  const { name, email } = req.body;
  
  if (!email || !name) {
    return res.status(400).json({ success: false, error: "Name and email are required" });
  }

  currentOtp = generateOTP();

  // Configure nodemailer - replace with your actual email credentials
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your.email@gmail.com", // Replace with your real Gmail
      pass: "your_app_password",    // Use App Password if 2FA is enabled
    },
  });

  const mailOptions = {
    from: '"StockVision" <your.email@gmail.com>',
    to: email,
    subject: "Your OTP for StockVision Login",
    text: `Hello ${name},\n\nYour OTP is: ${currentOtp}\n\n- StockVision Team`,
    html: `<p>Hello ${name},</p><p>Your OTP is: <strong>${currentOtp}</strong></p><p>- StockVision Team</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}: ${currentOtp}`);
    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ 
      success: false, 
      error: "Failed to send OTP",
      details: err.message 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});