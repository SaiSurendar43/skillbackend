import { Socket } from "socket.io";
import { SkillRequest } from "../models/skillrequest.js"
import mongoose from "mongoose";
import { User } from "../models/usermodel.js";


export const viewTeacher = async (req, res) => {

    const { teacherId } = req.params

    try {
        const incoming = await SkillRequest.find({ teacherId })
            .populate({ path: 'teacherId', select: 'name email' })
            .populate({ path: 'learnerId', select: 'name email' });

        res.json({ incoming })
    }

    catch (err) {
        console.error('Error in incoming:', err); // Log actual error
        res.status(500).json({ error: 'Something went wrong' });
    }
}

export const acceptStatus = async (req, res) => {

    try {

        const { id } = req.params;

        const { status } = req.body;

        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const updateRequest = await SkillRequest.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate('learnerId teacherId')

        if (!updateRequest) {
            return res.status(404).json({ message: "Request not found" });
        }

        res.status(200).json({ message: "Status updated", data: updateRequest });

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }

}

export const getRequestCount = async (req, res) => {

    try {
        const teacherId = req.params.teacherId;


        if (!mongoose.Types.ObjectId.isValid(teacherId)) {
            return res.status(400).json({ error: "Invalid teacher ID" });
        }

        const objectId = new mongoose.Types.ObjectId(teacherId); // ✅ string

        const total = await SkillRequest.countDocuments({ teacherId: objectId });
        const accepted = await SkillRequest.countDocuments({ teacherId: objectId, status: "accepted" });
        const pending = await SkillRequest.countDocuments({ teacherId: objectId, status: "pending" });
        const rejected = await SkillRequest.countDocuments({ teacherId: objectId, status: "rejected" });

        res.json({ total, accepted, pending, rejected });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getteacherDetails = async (req, res) => {
    const { teacherId } = req.params;

    try {
        if (!teacherId || teacherId === "undefined") {
            return res.status(400).json({ error: "Invalid teacherId" });
        }

        const teacher = await User.findById(teacherId).select("name email role");

        if (!teacher) {
            return res.status(404).json({ error: "Teacher not found" });
        }

        if (teacher.role !== "teacher") {
            return res.status(400).json({ error: "User is not a teacher" });
        }

        return res.status(200).json({
            name: teacher.name,
            email: teacher.email,
        });

    } catch (error) {
        console.error("Error fetching teacher details:", error);
        return res.status(500).json({ error: "Server error" });
    }
};

