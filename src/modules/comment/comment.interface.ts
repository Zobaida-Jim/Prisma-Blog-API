import { CommentStatus } from "../../../generated/prisma/enums.js";

export interface ICreateCommentPayload {
    postId: string;
    content: string;
}

export interface IUpdateCommentPayload {
    content: string;
}

export interface IModerateCommentPayload {
    status: CommentStatus
}