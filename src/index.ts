import express from "express";
import jwt from "jsonwebtoken";
import { ContentModel, dbConnect, UserModel } from "./db";
import { userMiddleware } from "./middleware";
import { JWT_PASSWORD } from "./config";

const app = express();
app.use(express.json());
dbConnect();

app.post("/api/v1/signup", async function(req, res){
    // zod validation
    const username = req.body.username;
    const password = req.body.password;

    try{
        await UserModel.create({
            username: username,
            password: password
        })

    // Add response handling. 
    // different response codes for diff usecase, such as username duplication
        res.json({
            message: "User signed up"
        })
    } catch (e) {
        res.status(403).json({
            message: "User already exists"
        })
    }

})

app.post("/api/v1/signin", async function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await UserModel.findOne({
        username,
        password
    })

    if (existingUser) {
        const token = jwt.sign({
            id: existingUser._id
        }, JWT_PASSWORD)

        res.json({
            token: token
        })

    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }

})

app.post("/api/v1/content", userMiddleware, async function(req, res){
    const link = req.body.link;
    const type = req.body.type;
    const title = req.body.title;

    try{
        await ContentModel.create({
            link,
            type,
            title,
            userId: req.userId,
            tags:[]
        })

        res.json({
            message: "Content added"
        })
    } catch(e) {
        res.status(403).json({
            message: e
        })
    }

})

app.get("/api/v1/content", userMiddleware, async function(req, res){
    const userId = req.userId;
    const content = await ContentModel.find({
        userId: userId
    }).populate("userId", "username")

    res.json({
        content
    })
})

app.delete("/api/v1/content", userMiddleware, async function(req, res){
    const contentId = req.body.contentId;

    if(!contentId){
        res.status(404).json({
            message: "contentId is needed"
        })
    }

    try{
        await ContentModel.deleteOne({
            _id: contentId,
            userId: req.userId
        })

        res.json({
            message: `${contentId} deleted`
        })
    } catch(e) {
        res.status(403).json({
            message: e
        })
    }
})

app.post("/api/v1/brain/share", function(req, res){
    
})

app.get("/api/v1/brain/:shareLink", function(req, res){

})


app.listen(3000);