import mongoose, { model } from "mongoose";

const SkillSchema = new mongoose.Schema({
    skill:{
        type:String,
        required:true
    },

    status:{
        type:String,
        enum:['pending',"accepted","rejected"],
        default:"pending"
    },

    learnerId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    teacherId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true}

})

export const SkillRequest = mongoose.model("skillrequest",SkillSchema)