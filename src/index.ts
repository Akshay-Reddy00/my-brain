import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import { ContentModel, dbConnect, LinkModel, UserModel } from "./db";
import { userMiddleware } from "./middleware";
import { DELETE_CONTENT, DELETE_USER, GET_CONTENT, GET_SHARED_CONTENT, 
        JWT_PASSWORD, POST_CONTENT, SHARE_CONTENT, SIGNIN, SIGNUP } from "./config";
import { Random } from "./utils";

const app = express();
app.use(express.json());
app.use(cors());
dbConnect();

app.post(SIGNUP, async function(req, res){
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

app.post(SIGNIN, async function(req, res){
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

app.post(POST_CONTENT, userMiddleware, async function(req, res){
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

app.get(GET_CONTENT, userMiddleware, async function(req, res){
    const userId = req.userId;
    const content = await ContentModel.find({
        userId: userId
    }).populate("userId", "username")

    res.json({
        content
    })
})

app.delete(DELETE_CONTENT, userMiddleware, async function(req, res){
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

app.post(SHARE_CONTENT, userMiddleware, async function(req, res){
    const share = req.body.share

    if(share) {
        const existingLink = await LinkModel.findOne({
            userId: req.userId
        });

        if(existingLink) {
            res.json({
                hash: '/share/' + existingLink.hash
            })
            return;
        }

        const hash = Random(10);
        await LinkModel.create({
            userId: req.userId,
            hash: hash
        })

        res.json({
            message: '/share/' + hash
        })
    } else {
        await LinkModel.deleteOne({
            userId: req.userId
        });

        res.json({
            message: "Removed link"
        })
    }
})

app.get(GET_SHARED_CONTENT, async function(req, res){
    const hash = req.params.shareLink;

    const link = await LinkModel.findOne({
        hash
    });

    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        })
        return;
    }
    const content = await ContentModel.find({
        userId: link.userId
    });

    const user = await UserModel.findOne({
        _id: link.userId
    })

    if(!user) {
        res.status(411).json({
            message: "User not found"
        })
        return;
    }

    res.json({
        username: user.username,
        content: content
    })
})

app.delete(DELETE_USER, userMiddleware, async function(req, res){
    const confirmationText = req.body.confirmationText;
    try {
        const user = await UserModel.findById(req.userId);
        if(!user) {
            res.status(400).json({
                error: "User does not exist"
            })
            return;
        }
    } catch(error) {
        res.status(500).json({
            error: "Not able to process the request" 
        })
        return;
    }
    if(confirmationText === 'DELETE') {
        try {
            await LinkModel.deleteMany({ userId: req.userId })
            await ContentModel.deleteMany({ userId: req.userId })
            await UserModel.findByIdAndDelete({
                _id: req.userId
            })

            res.json({
                message: `User, Content and Link with ${req.userId} deleted.`  
            })
        } catch(error) {
            res.status(500).json({
                message: error
            })
        }
    } else {
        res.status(400).json({
            message: "Invalid confirmation text"
        })
    }
})


app.listen(3000);