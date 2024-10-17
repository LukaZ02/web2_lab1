"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
// Initialize JWKS client to fetch signing keys from your Auth0 domain
const client = (0, jwks_rsa_1.default)({
    jwksUri: 'https://dev-pvbzlyzk7iws7q7a.eu.auth0.com/.well-known/jwks.json'
});
// Function to get the signing key from the JWKS URI
const getKey = (header, callback) => {
    client.getSigningKey(header.kid, (err, key) => {
        if (err) {
            callback(err);
        }
        else {
            const signingKey = key === null || key === void 0 ? void 0 : key.getPublicKey();
            callback(null, signingKey);
        }
    });
};
// Middleware to verify JWT tokens
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: 'No authorization token provided!' });
        return; // Return void, do not return Response object
    }
    const token = authHeader.split(' ')[1]; // Extract the token part from 'Bearer <token>'
    jsonwebtoken_1.default.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: 'Invalid or expired token!' });
            return; // Return void, do not return Response object
        }
        // Pass control to the next middleware or route handler
        next();
    });
};
exports.verifyToken = verifyToken;
