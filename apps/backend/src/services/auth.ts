import { env } from "../config/env.js"
import jwt from "jsonwebtoken";

const jwtSecretKey = env.JWT_SECRET_KEY;

export const getJWTToken = (username: string, password: string) => {
    const payload = { username, password };
    const token = jwt.sign(payload, jwtSecretKey);
    return token;
}

export const verifyJWT = (token: string) => {
    try {
        return jwt.verify(token, jwtSecretKey);
    } catch(error) {
        return null;
    }
}