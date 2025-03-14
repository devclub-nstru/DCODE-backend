import User from "../models/usermodel.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import admin from "../tools/firebaseAdmin.js";

export const googleAuth = async (req, res) => {
  var GoogleRevifyToken = req.body.token;

  try {
    const { email_verified, name, email, picture, sub } = await admin
      .auth()
      .verifyIdToken(GoogleRevifyToken);
    if (!email_verified) {
      return res.json({
        status: false,
        message: "Email not verified by Google",
      });
    }
    if (!email.endsWith("rishihood.edu.in")) {
      return res.json({
        status: false,
        message: "Please use collage Email ID",
      });
    }

    let user = await User.findOne({ $or: [{ googleId: sub }, { email }] });

    if (!user) {
      const username = name || email.split("@")[0];

      user = new User({
        username,
        email,
        googleId: sub,
        profilePicture: picture,
        isGoogleAccount: true,
      });

      await user.save();
    } else if (!user.googleId) {
      user.googleId = sub;
      user.isGoogleAccount = true;
      user.profilePicture = picture || user.profilePicture;

      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || "JWT_SECRET",
      { expiresIn: "1d" }
    );

    res.json({
      status: true,
      message: "Google authentication successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Google authentication error:", error);
    res.json({
      status: false,
      message: "Server error during Google authentication",
    });
  }
};
