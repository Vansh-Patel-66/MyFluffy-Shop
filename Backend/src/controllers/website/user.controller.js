import User from "../../models/user.model.js";
import crypto from "crypto";
import sendEmail from "../../utils/sendEmail.js";

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

export const createUser = async (req, res) => {
  try {
    const { email, password, role, is_active } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }
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

    const message = `Please verify your email by clicking the link below:\n\n${verificationUrl}`;
    const html = `<h1>Email Verification</h1><p>Please verify your email by clicking the link below:</p><a href="${verificationUrl}">Verify Email</a>`;

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

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

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

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      where: { verification_token: token },
    });

    if (!user) {
      return res
        .status(400)
        .json({
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
