import express from "express";
import connectDB from "./db.js";
import dotenv from "dotenv";
import apiRoutes from "./routes.js";
import cors from "cors";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);



const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(
        `Server running ${process.env.DEV_MODE} mode on port ${PORT}.`
    )
})