import type { Request, Response, NextFunction } from "express";

export const checkAuthentication = (redirectRoute: string = "/user/sign-in") => {
    return (req: Request, res: Response, next: NextFunction) => {
        if(req.isAuthenticated()) {
            next();
        } else {
            return res.status(401).redirect(redirectRoute);
        }
    }
}