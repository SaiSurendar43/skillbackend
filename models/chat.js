// Updated chat schema to include senderRole
import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
  text: String,
  from: String, // sender ID
  senderRole: String, // "teacher" or "learner"
  timestamp: { type: Date, default: Date.now },
})

const chatSchema = new mongoose.Schema({
  participants: {
    type: [String], // Array of user IDs
    required: true,
    index: true,
  },
  messages: [messageSchema],
})

export const ChatDesign = mongoose.model("chatusers", chatSchema)
