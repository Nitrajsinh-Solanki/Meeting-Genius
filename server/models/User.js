

import mongoose, { model } from "mongoose";
import bcryptjs from "bcryptjs";
const User = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            validate(value) {
                if (value.length < 4) {
                    throw new Error('username must be at least 4 characters long');
                }
                
            },
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            validate(value) {
                if (value.length < 8) {
                    throw new Error('password should be at least 8 characters long');
                }
            },
        },
    },
    { timestamps: true }
);


User.pre('save', async function (next) {
    const user = this;
    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = await bcryptjs.hash(user.password, salt);
    user.password = hashedPassword;
    next();
});

export default mongoose.model('User', User);