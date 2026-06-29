import { prisma } from "../../lib/prisma.js"
import { ICreateCommentPayload, IModerateCommentPayload, IUpdateCommentPayload } from "./comment.interface.js"

const createComment = async (authorId: string, payload: ICreateCommentPayload) => {
    await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postId
        }
    })

    const comment = await prisma.comment.create({
        data: {
            ...payload,
            authorId
        }, include: {
            post: {
                select: {
                    title: true,
                    content: true
                }
            }
        }
    })

    return comment;
}

const getCommentByAuthorId = async (authorId: string) => {
    const comments = await prisma.comment.findMany({
        where: {
            authorId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            post: {
                select: {
                    title: true,
                    content: true
                }
            }
        }
    })

    return comments;
}

const getCommentsByPostId = async (postId: string) => {
    const comments = await prisma.comment.findMany({
        where: {
            postId
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    return comments;
}

const updateComment = async (commentId: string, authorId: string, data: IUpdateCommentPayload) => {
    await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId,
            authorId
        }
    })

    const comment = await prisma.comment.update({
        where: {
            id: commentId,
            authorId
        },
        data,
        include: {
            post: {
                select: {
                    title: true,
                    content: true
                }
            }
        }
    })

    return comment;
}

const deleteComment = async (commentId: string, authorId: string) => {
    await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId,
            authorId
        }
    })

    const deletedComment = await prisma.comment.delete({
        where: {
            id: commentId,
            authorId
        }
    })
    return deletedComment;
}

const moderateComment = async (commentId: string, data: IModerateCommentPayload) => {
    const comment = await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId
        },
        select: {
            id: true,
            status: true
        }
    })

    if (comment.status === data.status) {
        throw new Error(`Your provided status ${comment.status} is already up to date.`);
    }

    const moderatedComment = await prisma.comment.update({
        where: {
            id: commentId
        },
        data
    })

    return moderatedComment;
}

export const CommentService = {
    createComment,
    getCommentByAuthorId,
    getCommentsByPostId,
    updateComment,
    deleteComment,
    moderateComment
}