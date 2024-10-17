import jwt, { JwtHeader } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { Request, Response, NextFunction } from 'express';

const client = jwksClient({
    jwksUri: process.env.JWKS_URI as string
});

// Function to get the signing key from the JWKS URI
const getKey = (header: JwtHeader, callback: (err: Error | null, key?: string | undefined) => void) => {
    client.getSigningKey(header.kid as string, (err, key) => {
        if (err) {
            callback(err);
        } else {
            const signingKey = key?.getPublicKey();
            callback(null, signingKey);
        }
    });
};

// Middleware to verify JWT tokens
export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ message: 'No authorization token provided!' });
        return;
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: 'Invalid or expired token!' });
            return;
        }

        next();
    });
};
