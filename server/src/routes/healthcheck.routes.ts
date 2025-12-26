import { Router } from "express";
import { healthCheckController } from "../controllers/healthcheck.controllers";

const router = Router();

router.get("/", healthCheckController);

export default router;