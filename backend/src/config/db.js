import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/ML-Dataset-MarketPlace`)
        console.log('MongoDB connected!');
        
    } catch (error) {
        console.log('Error in conneting Database', error);
        process.exit(1)
        
    }
}

export { connectDB }