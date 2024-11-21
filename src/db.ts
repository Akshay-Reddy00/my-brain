import 'dotenv/config';
import mongoose, { model, Schema } from "mongoose";

mongoose.connect(`${process.env.LOCAL_MONGO_URL}`);

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
    tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
})

export const ContentModel = model("Content", ContentSchema);