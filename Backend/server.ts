import app from "./app";
import init_routes from "./server-routes";
import init_dependencies from "./server-dependencies";
import { My_Mongo } from "./mongodb/init";

init_dependencies(app);
init_routes(app);

export const my_mongo = new My_Mongo();

const server_start = async () => {
    //waiting to connect to mongo db before running server
    try {
        await my_mongo.mongo_connect();
    }
    catch (err) {
        //terminating process if error occurs
        process.exit(1);
    }

    app.listen(5612, () => {
        console.log("Server listening at 5612....");
    });
}

server_start();