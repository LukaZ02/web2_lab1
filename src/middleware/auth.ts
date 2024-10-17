import jwt, { JwtPayload, JwtHeader } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { Request, Response, NextFunction } from 'express';

// Initialize JWKS client to fetch signing keys from your Auth0 domain
const client = jwksClient({
    jwksUri: 'https://dev-pvbzlyzk7iws7q7a.eu.auth0.com/.well-known/jwks.json'
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
        return;  // Return void, do not return Response object
    }

    const token = authHeader.split(' ')[1]; // Extract the token part from 'Bearer <token>'

    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: 'Invalid or expired token!' });
            return;  // Return void, do not return Response object
        }
        // Pass control to the next middleware or route handler
        next();
    });
};
