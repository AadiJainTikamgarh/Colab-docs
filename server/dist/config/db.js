import mongoose from 'mongoose';
export const connectDB = async () => {
    await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`);
    const connection = mongoose.connection;
    connection.on("connected", () => {
        console.log("DB Connected Successfully");
    });
};
//# sourceMappingURL=db.js.map