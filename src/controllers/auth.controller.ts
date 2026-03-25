import { Request, Response } from 'express';
import User from '../models/User'; 

export const register = async (req: Request, res: Response) : Promise<void>  => {
    try { 

        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        await user.save();

        res.status(201).json({
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
            res.status(422).json({ errors: { body: [ error.message ] } });
        }   
    }
};

export const login = async (req: Request, res: Response) : Promise<void> => {
    try {
        
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
             res.status(401).json({ errors: { body: ['Invalid email or password'] } });
            return;
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            res.status(401).json({ errors: { body: ['Invalid email or password']} });
            return
        }

        res.json({
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
            res.status(422).json({ errors: { body: [ error.message ] } });
        }
    }
};