import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectToDatabase from "./lib/db/connect";
import { User } from "./models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
	providers: [
		Credentials({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				console.log("AUTHORIZE CALL:", credentials);
				if (!credentials?.email || !credentials?.password) {
					console.log("Missing credentials");
					return null;
				}

				await connectToDatabase();
				const user = await User.findOne({
					email: credentials.email.toString().toLowerCase(),
				});
				console.log("DB USER FOUND:", user ? user.email : "none");

				if (!user || !user.isActive) {
					console.log("User not found or inactive.");
					return null;
				}

				const passwordsMatch = await bcrypt.compare(
					credentials.password.toString(),
					user.passwordHash,
				);
				console.log("PASSWORDS MATCH:", passwordsMatch);

				if (passwordsMatch) {
					console.log("LOGIN SUCCESS");
					return {
						id: user._id.toString(),
						email: user.email,
						name: user.fullName,
						role: user.role,
					};
				}

				return null;
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.role = user.role;
				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.role = token.role as string;
				session.user.id = token.id as string;
			}
			return session;
		},
	},
	pages: {
		signIn: "/login",
	},
	session: {
		strategy: "jwt",
	},
});
