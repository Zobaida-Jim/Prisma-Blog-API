import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { CommentService } from "./comment.service.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status";

const createComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authoId = req.user?.id;
    const payload = req.body;

    const comment = await CommentService.createComment(authoId as string, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Comment created successfully!!",
        data: {
            comment
        }
    })
})

const getCommentByAuthorId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.params.authorId;

    const comments = await CommentService.getCommentByAuthorId(authorId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Comments retrieved successfully!!",
        data: {
            comments
        }
    })
})

const getCommentsByPostId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;

    const comments = await CommentService.getCommentsByPostId(postId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Comments retrieved successfully!!",
        data: {
            comments
        }
    })
})

const updateComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const data = req.body;
    const authorId = req.user?.id;

    const updatedComment = await CommentService.updateComment(
        commentId as string,
        authorId as string,
        data
    )

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Comment updated successfully!!",
        data: {
            updatedComment
        }
    })
})

const deleteComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const authoId = req.user?.id;

    const deletedComment = await CommentService.deleteComment(commentId as string, authoId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Comment deleted successfully!!",
        data: {
            deletedComment
        }
    })
})

const moderateComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const { commentId } = req.params;

    const moderatedComment = await CommentService.moderateComment(commentId as string, data);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Comment status moderated successfully !",
        data: {
            moderatedComment
        }
    })
})


export const commentController = {
    createComment,
    getCommentByAuthorId,
    getCommentsByPostId,
    updateComment,
    deleteComment,
    moderateComment
}