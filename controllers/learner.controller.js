import mongoose from "mongoose";
import { ChatDesign } from "../models/chat.js";
import { SkillRequest } from "../models/skillrequest.js";
import { User } from "../models/usermodel.js"

export const GetTeacherSkill = async (req, res) => {

    const skill = req.query.skill

    try {
        const teacher = await User.findOne({
            role: "teacher",
            skills: { $in: [skill] }
        }).select('id name skills')

        if (!teacher) {
            return res.status(404).json({ message: `No teacher found with skill: ${skill}` });
        }

        res.json(teacher)
    }

    catch (err) {
        res.status(500).json({ message: 'Error fetching teachers' });
    }
}

export const skillRequest = async (req, res) => {

    const { skill, learnerId, teacherId } = req.body

    try {

        const existing = await SkillRequest.findOne({ skill, learnerId, teacherId })

        if (existing) {

            return res.status(400).json({
                message: "request already send"
            })
        }

        const request = new SkillRequest({
            skill,
            learnerId,
            teacherId
        })

        await request.save();
        res.status(201).json({ message: 'Skill request submitted', request });
    }

    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

export const ViewRequest = async (req, res) => {
    const { learnerId } = req.params;

    try {
        const request = await SkillRequest.find({ learnerId })
            .populate({ path: 'teacherId', select: 'name email' })
            .populate({ path: 'learnerId', select: 'name email' });

        res.json({ request });
    }
    catch (err) {
        console.error('Error in ViewRequest:', err); // Log actual error
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export const chatMessage = async (req, res) => {
    try {
        const { senderId, receiverId } = req.query;

        if (!senderId || !receiverId) {
            return res.status(400).json({ message: "senderId and receiverId are required" });
        }

        const participants = [String(senderId), String(receiverId)].sort();
        const chat = await ChatDesign.findOne({ participants });

        res.status(200).json({ messages: chat?.messages || [] });
    } catch (error) {
        console.error("Error fetching chat messages:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getRequestCount = async (req, res) => {
      
    try {
       const learnerId = req.params.learnerId;

        console.log("learnerId received:", learnerId);

        if (!mongoose.Types.ObjectId.isValid(learnerId)) {
            return res.status(400).json({ error: "Invalid learner ID" });
        }

        const objectId = new mongoose.Types.ObjectId(learnerId); // ✅ string

        const total = await SkillRequest.countDocuments({ learnerId: objectId });
        const accepted = await SkillRequest.countDocuments({ learnerId: objectId, status: "accepted" });
        const pending = await SkillRequest.countDocuments({ learnerId: objectId, status: "pending" });
        const rejected = await SkillRequest.countDocuments({ learnerId: objectId, status: "rejected" });

        res.json({ total, accepted, pending, rejected });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getlearnerDetails=async(req,res)=>{
    
      const {learnerId} = req.params

      try{
         
          if(!learnerId || learnerId === "undefined"){
            return res.status(400).json({ error: "Invalid learnerId" });
          }

          const learner = await User.findById(learnerId).select('name email role')

        if (!learner) {
            return res.status(404).json({ error: "learner not found" });
        }

        if (learner.role !== "learner") {
            return res.status(400).json({ error: "User is not a learner" });
        }

        return res.status(200).json({
            name: learner.name,
            email: learner.email,
        });

    } catch (error) {
        console.error("Error fetching teacher details:", error);
        return res.status(500).json({ error: "Server error" });
    }
}
