import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { z } from "zod";

import { zodValidate } from "./middlewares/zodValidate";
import { asyncHandler } from "./middlewares/asyncHandler";
import { errorHandler } from "./middlewares/errorHandler";
import { authMiddleware } from "./middlewares/auth.middleware";

import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";


// ✅ CREATE APP FIRST
const app = express();

// ✅ Global Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use("/api/auth", authRoutes);

// ✅ Routes
app.use("/api/users", userRoutes);

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Example protected route with Zod validation
const testSchema = z.object({
  body: z.object({
    name: z.string().min(2),
  }),
});

app.post(
  "/test",
  zodValidate(testSchema),
  asyncHandler(async (req: Request, res: Response) => {
    res.json({ success: true, name: req.body.name });
  })
);

// ✅ Error handler MUST be last
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});

app.get("/api/profile", authMiddleware, (req: any, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});