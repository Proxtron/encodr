import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const checkAuthentication = (redirectRoute: string = "/user/sign-in") => {
    return (req: Request, res: Response, next: NextFunction) => {
        if(req.isAuthenticated()) {
            next();
        } else {
            return res.status(401).redirect(redirectRoute);
        }
    }
}

export const validateForm = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array().map(e => e.msg);
    if (errors.length > 0) {                                                                                                         
        req.flash("errors", errors);
        return res.redirect("back");                                                                                                 
    }           
    next();
}

export const validationResultMiddleware = (
    view: string = "error", 
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array().map((error) => error.msg);
        if(errors.length > 0) {
            return res.status(400).render(view, {message: errors[0]});
        } else {
            next();
        }
    }
}