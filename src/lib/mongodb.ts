import mongoose from "mongoose";
const shared = globalThis as typeof globalThis & { mongoConnection?: Promise<typeof mongoose> };
export async function connectDB() {
    if (!process.env.MONGODB_URI) throw new Error("Missing MongoDB configuration");
    if (!shared.mongoConnection) shared.mongoConnection = mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    try { return await shared.mongoConnection; } catch (error) { shared.mongoConnection = undefined; throw error; }
}
const schema = new mongoose.Schema({ name: String, phone: String, email: String, service: String, location: String, message: String, consent: Boolean, emailStatus: { type: String, enum: ["pending", "sent", "failed"], default: "pending" } }, { timestamps: true });
export const Contact = mongoose.models.Contact || mongoose.model("Contact", schema);
const limitSchema = new mongoose.Schema({ _id: String, count: Number, expiresAt: { type: Date, index: { expires: 0 } } });
export const ContactLimit = mongoose.models.ContactLimit || mongoose.model("ContactLimit", limitSchema);
