import express from "express";
import { createCandidate, getAllCandidates, getCandidateById, updateCandidate, deleteCandidate } from "../controllers/candidate.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", protect, isAdmin, createCandidate);

router.get("/", getAllCandidates);


router.get("/:id", getCandidateById);

router.patch("/:id", protect, isAdmin, updateCandidate);

router.delete("/:id", protect, isAdmin, deleteCandidate)

export default router;