import { Knex } from "knex"
import { Model } from "objection"
import { maxHandleLength } from "@common/constrains/AuthConstrains"


export default class Auth extends Model {
    static get tableName() { return "auth" }
    id: number
    handle: string
    password_hash: string
    user_id: number


    public static async createModel(db: Knex) {
        if(!(await db.schema.hasTable(this.tableName))) {
            await db.schema.createTable(this.tableName, table => {
                table.increments("id").notNullable().primary()
                table.string("handle", maxHandleLength).notNullable().unique()
                table.string("password_hash").notNullable()
                table.integer("user_id").notNullable()
    
                table.foreign("user_id").references("id").inTable("user")
            })
        }
    }
}