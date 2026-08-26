import express from "express";
import { createElection, getAllElections, getElectionById, updateElection, deleteElection, getElectionCandidates } from "../controllers/election.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", protect, isAdmin, createElection);
router.get("/", getAllElections);
router.get("/:id", getElectionById);
router.patch("/:id", updateElection);
router.delete("/:id", protect, isAdmin, deleteElection);
router.get("/:id/candidates", protect, getElectionCandidates);

export default router;