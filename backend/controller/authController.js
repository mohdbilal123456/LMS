import mongoose from "mongoose";
import User from "../models/userModel.js";
import validator from 'validator'
import bcrypt from 'bcryptjs'
import genToken from "../config/token.js";
import sendMail from "../config/sendMail.js";

// Signup
// -------------------- SIGNUP --------------------
export const signUp = async (req, res) => {
      try {
            const { name, email, password, role } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser)
                  return res.status(400).json({ message: "User already exists" });

            // Email validation
            if (!validator.isEmail(email))
                  return res.status(400).json({ message: "Invalid email" });

            // Password validation
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
            if (!regex.test(password)) {
                  return res.status(400).json({
                        message:
                              "Password must be 8+ chars, include upper, lower, special chars",
                  });
            }

            // Educator validation
            if (role === "educator") {
                  const allowedEducators = process.env.ALLOWED_EDUCATORS.split(",").map(
                        (e) => e.trim()
                  );
                  if (!allowedEducators.includes(email)) {
                        return res
                              .status(403)
                              .json({ message: "Not authorized as educator" });
                  }
            }

            const hashPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                  name,
                  email,
                  password: hashPassword,
                  role,
            });

            const token = genToken(user._id);
            res.cookie("token", token, {
                  httpOnly: true,
                  secure: false,
                  sameSite: "lax",
                  maxAge: 5 * 24 * 60 * 60 * 1000,
            });

            return res.status(201).json({ user });
      } catch (error) {
            console.error("SignUp Error:", error);
            return res.status(500).json({ message: "Server Error", error: error.message });
      }
};

// -------------------- LOGIN --------------------
export const Login = async (req, res) => {
      try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ message: "User not found" });

            // Educator validation on login
            if (user.role === "educator") {
                  const allowedEducators = process.env.ALLOWED_EDUCATORS.split(",").map(
                        (e) => e.trim()
                  );
                  if (!allowedEducators.includes(user.email)) {
                        return res
                              .status(403)
                              .json({ message: "Not authorized as educator" });
                  }
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                  return res.status(400).json({ message: "Password is incorrect" });

            const token = genToken(user._id);
            res.cookie("token", token, {
                  httpOnly: true,
                  secure: false,
                  sameSite: "lax",
                  maxAge: 5 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({ user });
      } catch (error) {
            console.error("Login Error:", error);
            return res.status(500).json({ message: "Server Error", error: error.message });
      }
};

export const LogOut = async (req, res) => {
      try {
            await res.clearCookie("token", {
                  httpOnly: true,
                  secure: false,       
                  sameSite: "lax",   // must match cookie setup at login
            });
            return res.status(200).json({ message: "logOut Successfully" })
      }
      catch (error) {
            console.error("LogOut Error:", error);
            return res.status(500).json({ message: "Server Error", error: error.message });
      }
}


// controllers/authController.js

export const getCurrentUser = async (req, res) => {
      try {
            const token = req.cookies.token;
            if (!token) return res.status(200).json({ user: null });

            // JWT verify
            const userId = jwt.verify(token, process.env.JWT_SECRET).id;
            const user = await User.findById(userId).select('-password'); // password exclude
            if (!user) return res.status(200).json({ user: null });

            return res.status(200).json({ user });
      } catch (err) {
            return res.status(200).json({ user: null });
      }
};


// Google Auth
export const googleAuth = async (req, res) => {
      try {
            const { name, email, role } = req.body;

            if (role === "educator") {
                  return res.status(403).json({ message: "Google signup not allowed for educators" });
            }

            let user = await User.findOne({ email });
            if (!user) {
                  user = await User.create({
                        name,
                        email,
                        role,
                        isGoogleUser: true,
                        password: undefined,
                  });
            }

            const token = genToken(user._id);
            res.cookie("token", token, {
                  httpOnly: true,
                  secure: false,
                  sameSite: "lax",
                  maxAge: 5 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({ user });
      } catch (error) {
            console.error("GoogleAuth Error:", error);
            return res.status(500).json({ message: "Server Error", error: error.message });
      }
};


export const sendOtp = async (req, res) => {
      try {
            const { email } = req.body
            const user = await User.findOne({ email })

            if (!user) {
                  return res.status(400).json({ message: 'User in email Not Found' })
            }

            const otp = Math.floor(1000 + Math.random() * 9000).toString()
            user.resetOtp = otp
            user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
            user.isOtpVerified = false

            await user.save()
            await sendMail(email, otp)

            return res.status(200).json({ message: "Otp Send Successfully!!" })
      }
      catch (error) {
            console.error("Send Email  Error:", error);
            return res.status(500).json({ message: "Send Emai Error", error: error.message });
      }
}

export const verifyOtp = async (req, res) => {

      try {
            const { email, otp } = req.body
            const user = await User.findOne({ email })
            if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
                  return res.status(404).json({ message: "Invalid OTP !" })
            }
            user.isOtpVerified = true
            user.resetOtp = undefined
            user.otpExpires = undefined
            await user.save()
            return res.status(200).json({ message: "Otp Verified Successfully!!" })
      }
      catch (error) {
            console.error("verify otp  Error:", error);
            return res.status(500).json({ message: "verify otp ", error: error.message });
      }

}

export const resetPassword = async (req, res) => {

      try {
            const { email, password } = req.body
            const user = await User.findOne({ email })

            if (!user || !user.isOtpVerified) {
                  return res.status(404).json({ message: "OTP Verification Required !" })
            }

            const hashPassword = await bcrypt.hash(password, 10)
            user.password = hashPassword
            user.isOtpVerified = false
            await user.save()
            return res.status(200).json({ message: "Reset Password Successfully!!" })
      }
      catch (error) {
            console.error("verify otp  Error:", error);
            return res.status(500).json({ message: "Reset Password Error", error: error.message });
      }

}