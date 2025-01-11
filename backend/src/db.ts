import { knex, Knex } from "knex"
import setupSchema from "./models/SchemaSetup";
import { Model } from "objection";


const sqlite3Config: knex.Knex.Config = {
    client: "sqlite3",
    connection: {
        filename: "instance/test.sqlite"
    },
    useNullAsDefault: true
}


export class Database {
    private static instance: Database = null
    private dbInstance: Knex = null

    private constructor() {
        this.dbInstance = knex(
            sqlite3Config
        );

        process.on("exit", async () => {
            await this.dbInstance.destroy()
            console.log("Database instance destroyed.")
        })

        console.log("Database instance created!")
    }   

    public static async init() {
        if(Database.instance)
            throw new Error("Database instance has already been initialized!")
        
        Database.instance = new Database()
        Model.knex(Database.db)
        await setupSchema(Database.db)
        console.log("Database schema setup done!")
    }

    public static getInstance(): Database {
        if(!this.instance)
            throw new Error("Database has not beed initialized!")

        return this.instance
    }

    public static get db(): Knex {
        return this.getInstance().dbInstance
    }
}