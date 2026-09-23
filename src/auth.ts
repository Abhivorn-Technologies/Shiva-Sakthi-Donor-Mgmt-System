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
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				await connectToDatabase();
				const user = await User.findOne({
					email: credentials.email.toString().trim().toLowerCase(),
				});

				if (!user || !user.isActive) {
					return null;
				}

				const passwordsMatch = await bcrypt.compare(
					credentials.password.toString(),
					user.passwordHash,
				);

				if (passwordsMatch) {
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
			if (token.id) {
				await connectToDatabase();
				const dbUser = await User.findById(token.id);
				if (!dbUser || !dbUser.isActive) {
					// Invalidate token by removing role or throwing error? Let's clear role to force logout
					token.role = null;
				} else {
					token.role = dbUser.role;
				}
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
