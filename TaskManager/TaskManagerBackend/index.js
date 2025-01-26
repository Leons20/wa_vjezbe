import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import taskRouter from "./routes/tasks.js";

const PORT = 8000;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/tasks", taskRouter);

app.get("/", (req, res) => {
    res.send("TaskManagerBackend");
});

app.listen(PORT, () => {
    console.log(`Poslužitelj sluša na http://localhost:${PORT}`);
});