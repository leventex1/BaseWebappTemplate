import { Role } from "./Roles"

export default interface FUser {
    id: number
    firstName: string
    lastName: string
    role: Role
}