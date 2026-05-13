import http from "http";
import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/db";
import { Server } from "socket.io";
import { intiSocket } from "./sockets/index";
dotenv.config();
const PORT = process.env.PORT || 3000;
connectDB();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" },
});
intiSocket(io);
server.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map