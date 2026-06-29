import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

const PORT = config.port;

async function main() {
    try {
        await prisma.$connect();
        console.log("Database Connected Successfully");
        app.listen(PORT, () => {
            console.log(`Server is Listening on Port ${PORT}`);
        })
    } catch (error) {
        console.log("Error Catched : ", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();