import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import electionRoutes from "./routes/election.routes.js";
import candidateRoutes from "./routes/candidate.routes.js"
import voteRoutes from "./routes/vote.routes.js";
import resultRoutes from "./routes/result.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js"
const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/elections", electionRoutes);

app.use("/api/v1/candidates", candidateRoutes);

app.use("/api/v1/votes", voteRoutes);

app.use("/api/v1/dashboard", dashboardRoutes)



app.get("/", (req, res) => {
    res.send("Online Voting API is running...");
});

export default app;