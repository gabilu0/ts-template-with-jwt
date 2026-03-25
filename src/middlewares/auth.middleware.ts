import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { UserDocument } from '../models/User';

export interface AuthRequest extends Request {
    user?: UserDocument;
}


export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try{

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Token')) { 
            res.status(401).json({ errors: { body: 'Unauthorized' } });
            return;
        }


        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'secret'
        ) as { id: string };

        const user = await User.findById(decoded.id);

        if (!user) {
            res.status(401).json({errors: { body: 'User not found' } });
            return;
        }

        req.user = user;
        next();

    } catch {
        res.status(401).json({ errors: { body: 'Invalid token' } });
    }
};