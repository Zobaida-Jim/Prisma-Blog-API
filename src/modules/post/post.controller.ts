import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync.js"
import { postService } from "./post.service.js"
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status";

const createPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const payload = req.body;

    const post = await postService.createPost(payload, id as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Post created successfully!",
        data: {
            post
        }
    })
})

const getAllPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const posts = await postService.getAllPosts(query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All posts retrieved successfully!",
        data: {
            posts
        }
    })
})

const getPostsStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const stats = await postService.getPostsStats();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Post statistics retrieved successfully",
        data: {
            stats
        }
    })
})

const getMyPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;

    const posts = await postService.getMyPosts(authorId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Your posts retrieved successfully!",
        data: {
            posts
        }
    })
})

const getPostById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.postId;

    if (!id) {
        throw new Error("Post id is required in params");
    }

    const post = await postService.getPostById(id as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Post retrieved successfully !",
        data: {
            post
        }
    })
})

const updatePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const payload = req.body;
    const postId = req.params.postId;

    if (!postId) {
        throw new Error("Post Id is required in params.")
    }

    const result = await postService.updatePost(
        postId as string,
        payload,
        authorId as string
    )

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Your post updated successfully !",
        data: {
            result
        }
    })
})

const deletePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;
    const isAdmin = req.user?.role === "ADMIN";
    const authorId = req.user?.id;

    if (!postId) {
        throw new Error("Post Id is required in params.")
    }

    await postService.deletePost(
        postId as string,
        isAdmin,
        authorId as string
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Post deleted successfully!",
        data: null
    })
})

export const postController = {
    createPost,
    getAllPosts,
    getPostsStats,
    getMyPosts,
    getPostById,
    updatePost,
    deletePost
}