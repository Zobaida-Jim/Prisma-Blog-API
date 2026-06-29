import { Role } from "../../../generated/prisma/enums"

export interface RegisterIntoPayload {
    email: string
    name: string
    password: string
    role?: Role
    profilePhoto?: string
}