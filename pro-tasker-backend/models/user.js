import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please use a valid email address"],
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
    //   select: false, //hides password by default
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
      "Password must include uppercase, lowercase, number, and special character",
    ],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Set up pre-save middleware to create password
userSchema.pre("save", async function () {
  //'this' refers to the document we are trying to save to the database
  if (this.isNew || this.isModified("password")) {
    //no of times hash algorithms run
    const saltRounds = 10;
    // store the hashed password value into the password field
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
});






const User = mongoose.model("User", userSchema);
export default User;