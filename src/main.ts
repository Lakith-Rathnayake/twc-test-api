import express, {json} from "express";
import cors from 'cors';
import {UserHttpController} from "./api/user.http.controller";
import mongoose from "mongoose";

const app = express();

app.use(json());
app.use(cors());
app.use('/api/v1/users', UserHttpController)

mongoose.connect("mongodb://localhost:27017/school").then(() => console.log("Database connected"));

app.listen(5050, () => console.log("Server is listening on port 5050"));