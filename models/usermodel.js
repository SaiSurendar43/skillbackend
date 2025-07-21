import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:{
      type:String,
      enum:["learner","teacher"],
      default:"learner"
    },
    skills: [String],
})

export const User = mongoose.model("User",userSchema)