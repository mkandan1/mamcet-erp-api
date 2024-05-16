import { Employee } from "../models/Employee.js";
import bcrypt from 'bcryptjs';
import { generateToken } from "../services/auth/token.js";

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const doesUserExist = await Employee.findOne({ email: email });
    if (!doesUserExist) {
      return res
        .status(401)
        .json({ success: false, message: "User not found!" });
    }
    const passwordMatchResult = bcrypt.compareSync(password, doesUserExist.password);
    if (!passwordMatchResult) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }

    const payload = {
      uid: doesUserExist._id,
      role: doesUserExist.roles,
    };

    const tokenExpiration = new Date(Date.now() + 1000 * 60 * 60 * 24);
    const token = generateToken(payload);
    const cookieName = String(doesUserExist._id);

    res
      .cookie(cookieName, token, {
        expires: tokenExpiration,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .json({ success: true, message: "You have successfully logged in!" });
  } catch (err) {
    next(err);
  }
};

export { login };
