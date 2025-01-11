import { program } from "commander";
import { Database } from "src/db";
import AuthService from "src/services/AuthService";
import EncryptService from "src/services/EncryptService";


program.command("oneWay")
    .description("Uses the EncryptionService's onWayHash function")
    .argument("<string>", "Data to hash")
    .option("-c, --compare <string>", "Compares the hashed data with the original")
    .argument("<string>", "Data to encrypt")
    .action((origianl, options) => {
        const encryptService = new EncryptService()
        if(options.compare) {
            encryptService.compareOneWayHash(origianl, options.compare)
                .then(data => console.log(data))
        } else {
            encryptService.oneWayHash(origianl)
                .then(data => console.log(data))
        }
    })

program.command("jwt")
    .description("Encrypts the data with servers configs")
    .option("-v, --verify", "Decodes the encrypted data")
    .argument("<string>", "Data to encrypt")
    .action((data, options) => {
        const encryptService = new EncryptService()
        if(options.verify) {
            console.log(encryptService.verifyJWT(data))
        } else {
            console.log(encryptService.createJWT(data))
        }
    })

program.command("access-token")
    .description("Creates an access token with server configs")
    .argument("<number>", "User id")
    .action((data) => {
        const encryptServcie = new EncryptService()
        const authServcie = new AuthService(encryptServcie)
        console.log(authServcie.createAccessToken(data))
    })

program.command("refresh-token")
    .description("Uses the RefreshTokenService with the server configs")
    .option("-c, --check")
    .argument("<string>", "Refresh token")
    .action((token, options) => {
        Database.init()
        .then(() => {
            const encryptServcie = new EncryptService()
            const authServcie = new AuthService(encryptServcie)

            authServcie.getRefreshToken(token)
            .then((refreshToken) => {
                if(!refreshToken)
                    return console.log("Refresh token not found!")
                
                if(options.check) {
                    console.log(authServcie.isRefreshTokenValid(refreshToken))
                    process.exit(0)
                }
                console.log(refreshToken)
                process.exit(0)
            })
        })
        .catch(() => process.exit(-1))
    })
    
program.parse()