import { Role } from "@common/types/Roles"


export interface CreateUserProps {
    handle: string 
    password: string
    firstName: string
    lastName: string
    role: Role
}


export interface AuthUserProps {
    handle: string
    password: string
}