import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";

export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {

    const user = req.user!;

    res.status(200).json({
        user: {
            username: user.username,
            email: user.email,
            bio: user.bio,
            image: user.image,
            token: user.generateAuthToken(),
        },
    });
};

export const updateCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const { username, email, password, bio, image } = req.body;

        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = password;
        if (bio) user.bio = bio;
        if (image) user.image = image;

        await user.save();

        res.status(200).json({
            user: {
                username: user.username,
                email: user.email,
                bio: user.bio,
                image: user.image,
                token: user.generateAuthToken(),
            },
        });

    } catch (error: unknown) {
        if (error instanceof Error) { 
            res.status(400).json({ errors: { body: [ error.message ] } });
        }
    }

};