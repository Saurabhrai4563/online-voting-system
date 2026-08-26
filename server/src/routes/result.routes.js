import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";
import { getElectionResults } from "../controllers/result.controller.js";

const router = express.Router();

router.get("/:electionId", protect, isAdmin, getElectionResults);

export default router;