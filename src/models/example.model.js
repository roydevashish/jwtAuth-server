import mongoose, {Schema} from "mongoose";

const ExampleSchema = new Schema({
  col1: {
    type: String,
    required: [true, "Col1 field is required."]
  },
  col2: {
    type: String,
    required: [true, "Col2 field is required."]
  }
}, {timestamps: true});

const Example = mongoose.model("Example", ExampleSchema);

export default Example;