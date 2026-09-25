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
