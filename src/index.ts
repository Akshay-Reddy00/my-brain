import express from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "./db";

const JWT_PASSWORD = "akshay()123-#@!";

const app = express();
app.use(express.json());

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
    const exixtingUser = await UserModel.findOne({
        username,
        password
    })

    if (exixtingUser) {
        const token = jwt.sign({
            id: exixtingUser._id
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

app.post("/api/v1/content", function(req, res){
    
})

app.post("/api/v1/brain/share", function(req, res){
    
})

app.get("/api/v1/brain/:shareLink", function(req, res){

})


app.listen(3000);