import config from "../../config/index.js";
import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcryptjs";
import { RegisterIntoPayload } from "./user.interface.js";

const registerUserIntoDB = async (payload: RegisterIntoPayload) => {
    const { email, name, password, profilePhoto, role } = payload

    const isUserExist = await prisma.user.findUnique({
        where: { email }
    })

    if (isUserExist) {
        throw new Error("User with this email already exists !!");
    }

    const hashedPassword = await bcrypt.hash(password, Number(config.bycript_salt_rounds));

    const createdUser = await prisma.user.create({
        data: {
            email: email,
            name: name,
            password: hashedPassword,
            role: role,
            profile: {
                create: {
                    profilePhoto
                }
            }
        }
    })

    // await prisma.profile.create({
    //     data: {
    //         userId: createdUser.id,
    //         profilePhoto: profilePhoto
    //     }
    // })

    const user = await prisma.user.findUnique({
        where: {
            id: createdUser.id,
            email: createdUser.email || email
        },
        omit: {
            password: true
        },
        include: {
            profile: true
        }
    })

    return user
}

const getMyProfileFromDB = async (userId: string) => {
    const userProfile = await prisma.profile.findFirstOrThrow({
        where: { userId }
    })
    return userProfile;
}

const updateMyProfileIntoDB = async (userId: string, payload: any) => {
    const { name, email, bio, profilePhoto } = payload;

    const updatedUser = await prisma.user.update({
        where: {
            id: userId
        }, data: {
            email,
            name,
            profile: {
                update: {
                    bio,
                    profilePhoto
                }
            }
        }, omit: {
            password: true,
        }, include: {
            profile: true
        }
    })

    return updatedUser;
}

export const UserService = {
    registerUserIntoDB,
    getMyProfileFromDB,
    updateMyProfileIntoDB
}