import cookieParser from "cookie-parser";
import express, { Application, Request, Response, urlencoded } from "express";
import cors from "cors";
import config from "./config/index.js";
import { userRoutes } from "./modules/user/user.route.js";
import { authRoutes } from "./modules/auth/auth.route.js";
import { postRoutes } from "./modules/post/post.route.js";
import { commentRoutes } from "./modules/comment/comment.route.js";
import { notFound } from "./middlewares/notFound.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";

const app: Application = express();

//* Middleware
app.use(cors({
    origin: config.app_url,
    credentials: true
}))
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.send("Root Route : Hello World");
});

app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/comments", commentRoutes)

app.use(notFound)

app.use(globalErrorHandler)

export default app;