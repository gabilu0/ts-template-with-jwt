import mongoose, { Schema, Document, model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

interface Iuser {
    username: string;
    email: string;
    password: string;
    bio: string;
    image: string;
}

interface IUserMethods {
    generateAuthToken(): string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

type UserDocument = Document & Iuser & IUserMethods;

const userSchema = new Schema<UserDocument>(
    {
     username: { type: String, required: true, unique: true, trim: true },
     email:    { type: String, required: true, unique: true, trim: true, lowercase: true },
     password: { type: String, required: true},
     bio:      { type: String, default: '' },
     image:    { type: String, default: '' },
    },
    { 
     timestamps: true 
    }
)

userSchema.pre<UserDocument>('save', async function () {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

userSchema.methods.generateAuthToken = function (): string {
    return jwt.sign(
        {id: this._id},
        process.env.JWT_SECRET || 'secret',
        {expiresIn: '7d'}
    );
};

userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
    return bcrypt.compare(candidate, this.password);
};

const User = model<UserDocument>('User', userSchema);

export default User;
export type { UserDocument };