const User = require("../models/User");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  try {
    const request = req.body;
    const UserCount = await User.countDocuments();
    const existingUser = await User.findOne({ email: request.email });

    if (existingUser) {
      return res.status(400).json({
        UserCount,
        success: false,
        message: "User With This Email Already Exists",
      });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });

    const user = await User.create({
      ...request,
      otp,
      role: Boolean(UserCount) ? request.role || "user" : "super admin",
    });

    const token = jwt.sign(
      {
        _id: user._id,
        // email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const htmlFilePath = path.join(
      process.cwd(),
      "email-templates",
      "otp.html"
    );

    let htmlContent = fs.readFileSync(htmlFilePath, "utf8");

    htmlContent = htmlContent.replace(/<h1>[\s\d]*<\/h1>/g, `<h1>${otp}</h1>`);
    htmlContent = htmlContent.replace(
      /semiteprofessor@gmail\.com/g,
      user.email
    );

    let transporter = nodemailer.createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: process.env.RECEIVING_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let mailOptions = {
      from: process.env.RECEIVING_EMAIL,
      to: user.email,
      subject: "Verify your email",
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({
      success: true,
      message: "Created User Successfully",
      otp,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect Password" });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login Successfully",
      token,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { registerUser, loginUser };
