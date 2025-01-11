import { program } from "commander";
import { Database } from "src/db";
import { AdminCreateUserSchema } from "src/schemas/UserSchemas";
import AuthService from "src/services/AuthService";
import EncryptService from "src/services/EncryptService";
import UserService from "src/services/UserService";
import { validateOrThrow } from "src/utils/ValidateOrThrow";


program.command("create")
    .description("Creates user")
    .argument("<string>", "Handle")
    .argument("<string>", "Password")
    .argument("<string>", "First name")
    .argument("<string>", "Last name")
    .argument("<integer>", "role")
    .action(((handle, password, firstName, lastName, role) => {
        Database.init()
        .then(() => {
            const encryptServcie = new EncryptService()
            const authService = new AuthService(encryptServcie)
            const userService = new UserService(authService)

            const createUserProps = validateOrThrow({
                handle, password, firstName, lastName, role
            }, AdminCreateUserSchema)

            userService.createUser(
                createUserProps.handle,
                createUserProps.password,
                createUserProps.firstName,
                createUserProps.lastName,
                createUserProps.role
            )
                .then(() => {
                    console.log("User created!")
                    process.exit()
                })
            })
        .catch(() => {
            process.exit()
        })
    }))


program.command("get")
    .description("Gets user")
    .option("--id <number>", "ID of the desired user")
    .action((options) => {
        Database.init()
        .then(() => {
            const encryptServcie = new EncryptService()
            const authService = new AuthService(encryptServcie)
            const userService = new UserService(authService)

            if(options.id) {
                userService.getUserById(options.id)
                .then(user => {
                    console.log(user)
                    process.exit()
                })
            } else {
                userService.getUsers()
                .then(users => {
                    console.log(users)
                    process.exit()
                })
            }
        })
        .catch(() => process.exit())
    })

program.parse()