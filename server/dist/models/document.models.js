import mongoose, { Schema, Types } from "mongoose";
const collaboratorSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: "users",
        require: true,
    },
    role: {
        type: String,
        enum: ["viewer", "editor"],
        required: true,
    },
    addedAt: {
        type: Date,
        default: Date.now(),
        required: true,
    },
}, { _id: false });
const documentSchema = new Schema({
    title: {
        type: String,
        require: true,
        unique: true,
    },
    content: {
        type: Schema.Types.Mixed,
        require: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
        index: true,
    },
    collaborators: {
        type: [collaboratorSchema],
        default: [],
    },
    version: {
        type: Number,
        default: 1,
    },
}, { timestamps: true });
documentSchema.index({ owner: 1 });
documentSchema.index({ "collaborators.userId": 1 });
export const documents = mongoose.model("documents", documentSchema);
//# sourceMappingURL=document.models.js.map