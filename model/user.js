import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "User Name is required"],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
      lowercase: [true, "Email must be lowercase"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: 8,
      // match: [
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      //   "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      // ],
      // select: false, // Hide the password field in the response
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
