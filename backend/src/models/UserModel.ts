import { maxFirstName, maxLastName } from "@common/constrains/AuthConstrains"
import { Knex } from "knex"
import { Model } from "objection"
import FUser from "@common/types/FUser"
import { Role } from "@common/types/Roles"


export default class User extends Model {
    static get tableName() { return "user" }
    id: number
    first_name: string
    last_name: string
    role: Role


    public toFront = (): FUser => ({
        id: this.id,
        firstName: this.first_name,
        lastName: this.last_name,
        role: this.role
    })

    public static async createModel(db: Knex) {
        if(!(await db.schema.hasTable(this.tableName))) {
            await db.schema.createTable(this.tableName, table => {
                table.increments("id").notNullable().primary()
                table.string("first_name", maxFirstName).notNullable()
                table.string("last_name", maxLastName).notNullable()
                table.smallint("role").notNullable()
            })
        }
    }
}