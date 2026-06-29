import { Router } from "express";
import { UserController } from "./user.controller.js";
import { auth } from "../../middlewares/auth.js";
import { Role } from "../../../generated/prisma/enums.js";

const router = Router();

router.post("/register", UserController.registerUser);
router.get("/me", auth(Role.ADMIN, Role.AUTHOR, Role.USER), UserController.getMyProfile)
router.put("/my-profile", auth(Role.ADMIN, Role.AUTHOR, Role.USER), UserController.updateMyProfile)

export const userRoutes = router;