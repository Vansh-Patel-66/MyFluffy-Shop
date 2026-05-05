import User from "../../models/user.model.js";

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

    const newUser = await User.create({
      email,
      password,
      role: role || "user",
      is_active: is_active !== undefined ? is_active : true,
    });

    const userResponse = newUser.toJSON();
    delete userResponse.password;

    const token = newUser.generateToken();

    res.status(201).json({ success: true, token, data: userResponse });
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

    const userResponse = user.toJSON();
    delete userResponse.password;

    const token = user.generateToken();

    res.status(200).json({ success: true, token, data: userResponse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
