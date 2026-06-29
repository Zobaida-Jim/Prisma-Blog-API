import { Router } from "express";
import { commentController } from "./comment.controller.js";
import { auth } from "../../middlewares/auth.js";
import { Role } from "../../../generated/prisma/enums.js";

const router = Router();

router.post(
    "/",
    auth(Role.ADMIN, Role.AUTHOR, Role.USER),
    commentController.createComment
);

router.get("/author/:authorId", commentController.getCommentByAuthorId);

router.get("/:postId", commentController.getCommentsByPostId);

router.patch(
    "/:commentId",
    auth(Role.ADMIN, Role.USER, Role.AUTHOR),
    commentController.updateComment
);

router.delete(
    "/:commentId",
    auth(Role.ADMIN, Role.USER, Role.AUTHOR),
    commentController.deleteComment
);

router.patch(
    "/:commentId/moderate",
    auth(Role.ADMIN),
    commentController.moderateComment
);

export const commentRoutes = router;