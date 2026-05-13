export const intiSocket = (io) => {
    io.on("connected", (socket) => {
        console.log("Socket connected : ", socket.id);
    });
    io.on("disconnect", (socket) => {
        console.log("Socket Disconnected : ", socket.id);
    });
};
//# sourceMappingURL=index.js.map