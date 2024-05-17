import { Employee } from "../models/Employee.js";
import bcrypt from 'bcryptjs';
import { generateToken } from "../services/auth/token.js";
import { ObjectId } from "mongodb";

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

const onAuthState = async function (req, res, next) {
  try {
      const { uid } = req.user;
      const user = await Employee.findOne({ _id: new ObjectId(uid) }).select('-password');
      if (!user) {
          return res.status(401).json({ success: false, message: "User does not exist in our record" })
      }
      return res.status(200).json({ success: true, message: "User state has verified", user })
  }
  catch (err) {
      next(err)
  }
}

export { login, onAuthState };
