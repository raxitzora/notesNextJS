import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URL;

if (!MONGO_URI) {
  throw new Error("MONGODB_URL is not defined in environment variables");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI)
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  console.log("MongoDB connected");
  return cached.conn;
}

export default dbConnect;
