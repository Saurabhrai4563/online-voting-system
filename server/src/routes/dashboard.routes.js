import express from "express";
import { getAdminDashboard } from "../controllers/dashboard.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/admin", protect, isAdmin, getAdminDashboard);

export default router;