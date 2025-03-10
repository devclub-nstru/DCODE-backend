// controllers/googleauthcontroller.js
import User from '../models/usermodel.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
    try {
        const { tokenId } = req.body;
        
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        
        const { email_verified, name, email, picture, sub } = ticket.getPayload();
        
        if (!email_verified) {
            return res.status(400).json({ message: 'Email not verified by Google' });
        }
        
        let user = await User.findOne({ $or: [{ googleId: sub }, { email }] });
        
        if (!user) {
            const username = name || email.split('@')[0];
            
            user = new User({
                username,
                email,
                googleId: sub,
                profilePicture: picture,
                isGoogleAccount: true
            });
            
            await user.save();
        } else if (!user.googleId) {
            // Link existing account with Google
            user.googleId = sub;
            user.isGoogleAccount = true;
            user.profilePicture = picture || user.profilePicture;
            
            await user.save();
        }
        
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET || 'JWT_SECRET',
            { expiresIn: '1d' }
        );
        
        res.status(200).json({
            message: 'Google authentication successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.error('Google authentication error:', error);
        res.status(500).json({ message: 'Server error during Google authentication' });
    }
};