import { env } from "../config/env.js"
import jwt from "jsonwebtoken";

export const getJWTToken = (username: string, password: string) => {
    const jwtSecretKey = env.JWT_SECRET_KEY;
    const payload = { username, password };
    const token = jwt.sign(payload, jwtSecretKey);
    return token;
}