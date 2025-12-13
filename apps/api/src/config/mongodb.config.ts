export default () => ({
    mongo: {
        uri: process.env.MONGO_URI,
        db: process.env.MONGO_DB,
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASS
    }
});