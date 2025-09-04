import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import APIResponse from "../utils/APIResponse.js";
import APIError from "../utils/APIError.js";

const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if(!email && !password) {
    throw new APIError(400, "Email and Password both required.");
  }

  try {
    const existingUser = await User.findOne({ email });
    if(existingUser) {
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

export {
  register
}