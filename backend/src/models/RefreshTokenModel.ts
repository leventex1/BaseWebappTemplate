import { Knex } from "knex"
import { Model } from "objection"


export default class RefreshToken extends Model {
    static get tableName() { return "refresh_token" }
    id: number
    token: string
    expiration: Date
    user_id: number


    public static async createModel(db: Knex) {
        if(!(await db.schema.hasTable(this.tableName))) {
            await db.schema.createTable(this.tableName, table => {
                table.increments("id").notNullable().primary()
                table.string("token").notNullable()
                table.date("expiration").notNullable()
                table.integer("user_id").notNullable()
    
                table.foreign("user_id").references("id").inTable("user")
            })
        }
    }
}