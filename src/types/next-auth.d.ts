/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react/no-unescaped-entities */
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			role: string;
		} & DefaultSession["user"];
	}

	interface User {
		id: string;
		role: string;
	}
}
