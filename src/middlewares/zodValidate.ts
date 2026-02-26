import { ZodTypeAny } from "zod";
import { Request, Response, NextFunction } from "express";

export const zodValidate =
    (schema: ZodTypeAny) =>
        (req: Request, res: Response, next: NextFunction) => {
            try {
                schema.parse({
                    body: req.body,
                    query: req.query,
                    params: req.params,
                });
                next();
            } catch (error: any) {
                return res.status(400).json({
                    message: "Validation failed",
                    errors: error?.errors ?? error?.issues ?? error,
                });
            }
        };