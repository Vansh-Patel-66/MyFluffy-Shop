import User from "../../models/user.model.js";
import Joi from "joi";

//admin login
export const adminLogin = async (req, res) => {
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

    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Admins only." });
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
