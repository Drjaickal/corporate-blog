import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

export const register = async (req: Request, res: Response) => {
    try {
        const { email, name, password } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });

        return res.status(201).json({
            message: "User registered",
            user,
        });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !user.password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.json({ token });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};