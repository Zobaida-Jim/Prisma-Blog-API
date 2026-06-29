import { CommentStatus, PostStatus } from "../../../generated/prisma/enums.js";
import { PostWhereInput } from "../../../generated/prisma/models.js";
import { prisma } from "../../lib/prisma.js"
import { ICreatePostPayload, IPostQuery, IUpdatePostPayload } from "./post.interface.js"

const createPost = async (payload: ICreatePostPayload, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...payload,
            authorId: userId
        },
        include: {
            author: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    })

    return result;
}

const getAllPosts = async (query: IPostQuery) => {

    const andConditions: PostWhereInput[] = [];
    const tags = query.tags ? JSON.parse(query.tags as string) : null;
    const tagsArray = Array.isArray(tags) ? tags : [];

    if (query.searchTerm) {
        andConditions.push({
            OR: [
                {
                    title: {
                        contains: query.searchTerm,
                        mode: "insensitive"
                    }
                },
                {
                    content: {
                        contains: query.searchTerm,
                        mode: "insensitive"
                    }
                },
                {
                    tags: {
                        hasSome: tagsArray
                    }
                }
            ]
        })
    }

    if (query.title) {
        andConditions.push({
            title: query.title
        })
    }
    if (query.content) {
        andConditions.push({
            content: query.content
        })
    }
    if (query.isFeatured) {
        andConditions.push({
            isFeatured: Boolean(query.isFeatured)
        })
    }
    if (query.status) {
        andConditions.push({
            status: query.status
        })
    }
    if (query.authorId) {
        andConditions.push({
            authorId: query.authorId
        })
    }
    if (query.tags) {
        andConditions.push({
            tags: {
                hasSome: tagsArray
            }
        })
    }

    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1
    const skip = (page - 1) * limit;

    const sortBy = query.sortBy ? query.sortBy : "createdAt";
    const sortOrder = query.sortOrder ? query.sortOrder : "desc";

    const posts = await prisma.post.findMany({

        where: {
            AND: andConditions
        },

        //* Pagination
        take: limit,
        skip: skip,

        //* Sorting
        orderBy: {
            // sortBy: sortOrder
            [sortBy]: sortOrder
        },

        include: {
            author: {
                select: {
                    name: true,
                    email: true
                }
            },
            comments: true
        }
    })

    return posts;
}

const getPostsStats = async () => {
    const transacetionResult = await prisma.$transaction(
        async (tx) => {
            const [
                totalPosts,
                totalPublishedPosts,
                totalDraftPosts,
                totalArchivedPosts,
                totalComments,
                totalApprovedComments,
                totalRejectedComments,
                totalPostViewsAggregate
            ] = await Promise.all([
                await tx.post.count(),

                await tx.post.count({
                    where: {
                        status: PostStatus.PUBLISHED
                    }
                }),

                await tx.post.count({
                    where: {
                        status: PostStatus.DRAFT
                    }
                }),

                await tx.post.count({
                    where: {
                        status: PostStatus.ARCHIVED
                    }
                }),

                await tx.comment.count(),

                await tx.comment.count({
                    where: {
                        status: CommentStatus.APPROVED
                    }
                }),

                await tx.comment.count({
                    where: {
                        status: CommentStatus.REJECT
                    }
                }),

                await tx.post.aggregate({
                    _sum: {
                        views: true
                    }
                })
            ])

            return {
                totalPosts,
                totalPublishedPosts,
                totalDraftPosts,
                totalArchivedPosts,
                totalComments,
                totalApprovedComments,
                totalRejectedComments,
                totalPostViews: totalPostViewsAggregate._sum.views
            }
        }
    );

    return transacetionResult;
}

const getMyPosts = async (authorId: string) => {
    const posts = await prisma.post.findMany({
        where: {
            authorId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            comments: true,
            author: {
                select: {
                    name: true,
                    email: true
                }
            },
            _count: {
                select: {
                    comments: true
                }
            }
        }
    })

    return posts;
}

const getPostById = async (postId: string) => {
    const transacetionResult = await prisma.$transaction(
        async (tx) => {
            await tx.post.update({
                where: {
                    id: postId
                },
                data: {
                    views: {
                        increment: 1
                    }
                }
            })

            //! throw new Error("FAKE ERROR !!!!");

            const post = await prisma.post.findUniqueOrThrow({
                where: {
                    id: postId
                },
                include: {
                    author: {
                        select: {
                            name: true,
                            email: true
                        }
                    },
                    comments: {
                        where: {
                            status: CommentStatus.APPROVED
                        },
                        orderBy: {
                            createdAt: "desc"
                        }
                    },
                    _count: {
                        select: {
                            comments: true
                        }
                    }
                }
            })

            return post
        }
    )

    return transacetionResult;
}

const updatePost = async (postId: string, payload: IUpdatePostPayload,
    authorId: string) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    })

    if (post.authorId !== authorId) {
        throw new Error("You are not elligible to update this post.")
    }

    const result = await prisma.post.update({
        where: {
            id: postId
        },
        data: payload,
        include: {
            author: {
                select: {
                    name: true,
                    email: true
                }
            },
            comments: true,
            _count: {
                select: {
                    comments: true
                }
            }
        }
    })

    return result;
}

const deletePost = async (postId: string, isAdmin: boolean,
    authorId: string) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    });

    if (!isAdmin && post.authorId !== authorId) {
        throw new Error("You are not elligible to delete this post...!");
    }

    await prisma.post.delete({
        where: {
            id: postId
        }
    })

}

export const postService = {
    createPost,
    getAllPosts,
    getPostsStats,
    getMyPosts,
    getPostById,
    updatePost,
    deletePost
}