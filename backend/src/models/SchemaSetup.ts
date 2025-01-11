import { Knex } from "knex";
import User from "./UserModel";
import RefreshToken from "./RefreshTokenModel";
import Auth from "./AuthModel";


export default async function setupSchema(db: Knex) {
    await User.createModel(db)
    await RefreshToken.createModel(db)
    await Auth.createModel(db)
}