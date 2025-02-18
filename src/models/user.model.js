import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trime: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trime: true,
        },
        fullName: {
            type: String,
            required: true,
            trime: true,
            index: true,
        },
        avatar: {
            type: String,  // cluod se lege
            required: true,
        },
        coverImage: {
            type: String,
        },
        watchHistory: {
            type: Schema.Types.ObjectId,
            ref: "video"
        },
        password: {
            type: String,
            required: [true, 'password is required'],
        },
        refreshToken: {
            type: String,
        }
    }, { timestamps: true }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) next()

    this.password = bcrypt.hash(this.password, 10)
    next()

})

userSchema.method.isPasswordCorrect = async function(password){
 return await bcrypt.compare(password, this.password)
}

userSchema.method.generateAccessToken = function(){
    
    return jwt.sign(
        {
            _id : this.id,
            email: this.email,
            username : this.username,
            fullName :this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn :process.env.ACCESS_TOKEN_EXPIRY
        }   
    )
}
userSchema.method.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_SECRET
        }
    )  
}

export const User = mongoose.model("User", userSchema)