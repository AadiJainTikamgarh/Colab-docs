import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const corsOptions = {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.set("trust proxy", 1); // Trust first proxy
import healthCheckRouter from "./routes/healthcheck.routes";
import authRouter from "./routes/auth.routes";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import documentRouter from "./routes/document.routes";
app.use("/api/v1/documents", documentRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/healthcheck", healthCheckRouter);
// Error handler middleware - must be after all routes
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map