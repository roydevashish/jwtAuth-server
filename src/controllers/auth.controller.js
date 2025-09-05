import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import APIResponse from "../utils/APIResponse.js";
import APIError from "../utils/APIError.js";
import { cookieOptions } from "../utils/cookie.js";
import jwt from "jsonwebtoken";

const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    throw new APIError(400, "Email and Password both required.");
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new APIError(400, "User already exists.");
    }

    const newUser = await User.create({
      email: email.toLowerCase(),
      password
    });

    const resData = {
      _id: newUser._id,
      email: newUser.email
    }

    res.status(201).json(
      new APIResponse(201, resData, "User registered successfully.")
    );
  } catch (error) {
    console.log("🚫 Internal server error: ");
    console.log(error);
    res.status(500).json(
      new APIError(500, "Internal server error.")
    );
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new APIError(400, "Email and Password both required.");
  }

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new APIError(400, "User doesn't exists.");
    }

    const isPasswordCorrect = await existingUser.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      throw new APIError(400, "Invalid credentials.");
    }

    const accessToken = existingUser.generateAccessToken();
    const refreshToken = existingUser.generateRefreshToken();

    existingUser.refreshToken = refreshToken;
    await existingUser.save();

    const resData = {
      "_id": existingUser._id,
      "email": existingUser.email,
      "accessToken": accessToken,
      "refreshToken": refreshToken
    }

    res.status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new APIResponse(200, resData, "User logged in successfully.")
      );
  } catch (error) {
    console.log("🚫 Internal server error: ");
    console.log(error);
    res.status(500).json(
      new APIError(500, "Internal server error.")
    );
  }
});

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $unset: {
      refreshToken: 1
    }
  }, {
    new: true
  });

  res.status(200).clearCookie("accessToken").clearCookie("refreshToken").json(
    new APIResponse(200, null, "User logged out successfully.")
  );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    throw new APIError(400, "Invalid credentials.");
  }

  try {
    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select("-password");
    if (!user) {
      throw new APIError(404, "User doesn't exists.");
    }

    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save();

    const resData = {
      "_id": user._id,
      "email": user.email,
      "accessToken": newAccessToken,
      "refreshToken": newRefreshToken
    }

    res.status(200)
      .cookie("accessToken", newAccessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json(
        new APIResponse(200, resData, "Tokens refreshed successfully.")
      );
  } catch (error) {
    throw new APIError(401, "Unauthorized.");
  }
});

export {
  register,
  login,
  logout,
  refreshAccessToken
}