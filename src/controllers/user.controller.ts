import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const createUser = async (req: Request, res: Response) => {
    const { email, name } = req.body;

    const user = await prisma.user.create({
        data: {
            email,
            name,
        },
    });

    res.status(201).json(user);
};