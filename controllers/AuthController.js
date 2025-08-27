import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { studentModel } from "../database/db.js";

class AuthController {
  static addStudent = async (req, res) => {
    try {
      const newPassword = await bcrypt.hash(req.body.password, 10);
      const { firstName, lastName, age, email, mobile, password } = req.body;
      if (!firstName || !lastName || !age || !mobile || !email || !password) {
        return res.status(403).json({ error: "Please Fill all the Details" });
      }

      const preRecord = await studentModel.findOne({ email: req.body.email });
      if (preRecord) {
        return res
          .status(409)
          .json({ error: "User Already Registered With this Email Id" });
      }

      const doc = new studentModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        mobile: req.body.mobile,
        email: req.body.email,
        password: newPassword,
      });
      const result = await doc.save();

      const token = jwt.sign(
        {
          studentId: result._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "30m" }
      );

      res.cookie("jwtToken", token, {
        expires: new Date(Date.now() + 30 * 60 * 100),
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
      res.status(201).json(result);
    } catch (err) {
      res.status(403).json({ error: err.message });
    }
  };

  static getStudentByEmail = async (req, res) => {
    try {
      const result = await studentModel.findOne({ email: req.body.email });

      if (!result) return res.status(404).json({ error: "No Student Exist" });

      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        result.password
      );

      if (isPasswordValid) {
        const token = jwt.sign(
          {
            studentId: result._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "30m" }
        );

        res.cookie("jwtToken", token, {
          expires: new Date(Date.now() + 30 * 60 * 1000),
          httpOnly: true,
          secure: true,
          sameSite: "None",
        });
        return res
          .status(200)
          .json({ student: { result }, error: "Valid User" });
      } else {
        return res.status(403).json({ error: "Check Password" });
      }
    } catch (err) {
      return res.status(404).json({ error: "Error occured" });
    }
  };

  static logout = async (req, res) => {
    try {
      res.cookie("jwtToken", "", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        expires: new Date(0),
      });
      return res.status(200).json({ error: "Log Out Successfully" });
    } catch (err) {
      res.status(500).json({ error: "Cant Logout" });
    }
  };
}

export default AuthController;
