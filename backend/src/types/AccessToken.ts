import { Role } from "@common/types/Roles";

export interface AccessTokenType {
    userId: number,
    role: Role
}