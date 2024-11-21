import mongoose, { model, Schema } from "mongoose";



mongoose.connect("mongodb://localhost:27017/brainly");

const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true},
});

export const UserModel = model("User", UserSchema); // 'User' table in MongoDb

const contentTypes = ['image', 'video', 'article', 'audio'];

const ContentSchema = new Schema({
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true},
    title: { type: String, required: true},
    // tags: [{ type: Types.ObjectId, ref: 'Tag' }],
    // userId: { type: Types.ObjectId, ref: 'User', required: true },
})

export const ContentModel = model("Content", ContentSchema);