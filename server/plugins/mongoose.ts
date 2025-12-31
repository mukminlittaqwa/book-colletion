import mongoose from "mongoose";

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig();
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(config.mongodbUri);
    console.log("asik running");
  } catch (err) {
    console.error("connection mongodb nya error kak:", err);
  }
});
