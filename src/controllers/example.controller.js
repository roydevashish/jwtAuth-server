import asyncHandler from "../utils/asyncHandler.js";
import Example from "../models/example.model.js";
import APIResponse from "../utils/APIResponse.js";
import APIError from "../utils/APIError.js";

const exampleGetController = asyncHandler(async (req, res) => {
  try {
    const allExamples = await Example.find();
    
    return res.status(200).json(
      new APIResponse(200, allExamples, "All examples fetched successfully.")
    ); 
  } catch (error) {
    console.log(`🚫 Internal Server Error: `);
    console.log(error);
    throw new APIError(500, "Internal server error.");
  }
});

const examplePostController = asyncHandler(async (req, res) => {
  const {col1, col2} = req.body;

  const newExample = new Example({col1, col2});

  try {
    const savedExample = await newExample.save();
    
    return res.status(201).json(
      new APIResponse(201, savedExample, "Example saved successfully.")
    );
  } catch(error) {
    console.log(`🚫 Internal Server Error: `);
    console.log(error);
    throw new APIError(500, "Internal server error.");
  }
});

export {
  exampleGetController,
  examplePostController
};