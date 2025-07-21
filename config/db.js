import mongoose from "mongoose"


export const connectDb =async()=>{
   try{
    await mongoose.connect(process.env.MONGODB_URI)
     console.log("MongoDb connected")
   }
   catch(error){
      console.error("MongoDb Connection Failed",error.message);
      process.exit(1);
   }
}