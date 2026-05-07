import User from "../../models/user.model.js";
import crypto from "crypto";
import sendEmail from "../../utils/sendEmail.js";
import Joi from "joi";

//get all users
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const records = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedRecords = records.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      total: records.length,
      page: parseInt(page),
      limit: parseInt(limit),
      data: paginatedRecords,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get user by email
export const getUserByEmail = async (req, res) => {
  try {
    const record = await User.findOne({
      where: { email: req.params.email },
      attributes: { exclude: ["password"] },
    });
    if (record) res.status(200).json({ success: true, data: record });
    else res.status(404).json({ success: false, message: "User not found" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//create user with email verification
export const createUser = async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      role: Joi.string().valid("user", "admin").optional(),
      is_active: Joi.boolean().optional(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const { email, password, role, is_active } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
      email,
      password,
      role: role || "user",
      is_active: false,
      is_email_verified: false,
      verification_token: verificationToken,
    });

    const verificationUrl = `${req.protocol}://${req.get(
      "host",
    )}/api/users/verify/${verificationToken}`;

    const message = `Welcome to MyFluffyShop!\n\nThank you for registering. Please verify your email by clicking the link below:\n\n${verificationUrl}\n\nIf you did not request this, please ignore this email.`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Welcome to MyFluffyShop!</h2>
        <p>Hi there,</p>
        <p>Thank you for signing up for MyFluffyShop. We're excited to have you! To get started, please confirm your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify My Email</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #555;">${verificationUrl}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">If you didn't create an account, you can safely ignore this email.</p>
      </div>
    `;

    try {
      await sendEmail({
        email: newUser.email,
        subject: "Email Verification - MyFluffyShop",
        message,
        html,
      });

      res.status(201).json({
        success: true,
        message:
          "Registration successful. Please check your email to verify your account.",
      });
    } catch (error) {
      console.error(error);
      await newUser.destroy();
      res.status(500).json({
        success: false,
        message: "Email could not be sent. Please try again later.",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//update user by email
export const updateUserByEmail = async (req, res) => {
  try {
    const [updated] = await User.update(req.body, {
      where: { email: req.params.email },
    });
    if (updated) {
      const updatedRecord = await User.findOne({
        where: { email: req.params.email },
        attributes: { exclude: ["password"] },
      });
      res.status(200).json({ success: true, data: updatedRecord });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//delete user by email
export const deleteUserByEmail = async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { email: req.params.email },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//login user
export const loginUser = async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (!user.is_email_verified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email to login",
      });
    }

    const userResponse = user.toJSON();
    delete userResponse.password;

    const token = user.generateToken();

    res.status(200).json({ success: true, token, data: userResponse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//verify email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      where: { verification_token: token },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    user.is_email_verified = true;
    user.is_active = true;
    user.verification_token = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now login.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
