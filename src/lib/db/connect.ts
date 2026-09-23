import mongoose from "mongoose";

declare global {
	var mongooseCache: {
		conn: typeof mongoose | null;
		promise: Promise<typeof mongoose> | null;
	};
}

let cached = global.mongooseCache;

if (!cached) {
	cached = global.mongooseCache = { conn: null, promise: null };
}

async function connectToDatabase() {
	if (cached.conn) {
		return cached.conn;
	}

	const MONGODB_URI = process.env.MONGODB_URI;

	if (!MONGODB_URI) {
		throw new Error(
			"Please define the MONGODB_URI environment variable inside .env",
		);
	}

	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
			maxPoolSize: 10,
		};

		cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
			return mongoose;
		});
	}

	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = null;
		throw e;
	}

	return cached.conn;
}

export default connectToDatabase;
