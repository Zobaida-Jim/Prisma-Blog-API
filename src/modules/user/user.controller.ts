import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status"
import { UserService } from "./user.service.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";

const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await UserService.registerUserIntoDB(payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registered Successfully !",
        data: { user }
    })
})

const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const profile = await UserService.getMyProfileFromDB(req.user?.id as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User profile fetched successfully",
        data: {
            profile
        }
    })
})

const updateMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;

    const payload = req.body;

    const updatedProfile = await UserService.updateMyProfileIntoDB(userId, payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User profile updated successfully",
        data: {
            updatedProfile
        }
    })
})

export const UserController = {
    registerUser,
    getMyProfile,
    updateMyProfile
}