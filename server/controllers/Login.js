

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv();
import User from "../models/User.js";
const login = async (req, res, next) => {
  try {
    let foundUser = await User.findOne({
      email: req.body.email,
    }).exec();
   
    if (foundUser) {
      let submittedPass = req.body.password;
      let storedPass = foundUser.password;
      const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
      if (passwordMatch) {
        let usrname = foundUser.username;
        let id = foundUser._id;
        const token = jwt.sign(
          { user: { usrname, id } },
          process.env.JWT_SECRET,
          { expiresIn: "10d" }
        );
        res.status(200).json({
          username: foundUser.username,
          email: foundUser.email,
          id: foundUser._id,
          token: token,
        });
      } else {
        res.status(401).json({
          error: "Invalid password",
        });
      }
    } else {
      res.status(401).json({
        error: "no such email exists",
      });
    }
  } catch {
    res.status(500).json({
      error: "auth server error",
    });
  }
};
export default login;