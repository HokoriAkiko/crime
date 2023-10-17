import { Request, Response } from "express"
export const error_handler = (req: Request, res: Response, err?: any) => {
    res.send({
        message: `${err}`
    });
}