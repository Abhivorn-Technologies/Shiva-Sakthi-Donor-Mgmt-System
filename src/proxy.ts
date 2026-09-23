import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
	const isLoggedIn = !!req.auth;
	const { pathname } = req.nextUrl;

	if (
		!isLoggedIn &&
		(pathname.startsWith("/admin") || pathname.startsWith("/coordinator"))
	) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	if (isLoggedIn) {
		const role = req.auth?.user?.role;
		if (pathname.startsWith("/admin") && role !== "ADMIN") {
			return NextResponse.redirect(new URL("/coordinator/dashboard", req.url));
		}
		if (pathname.startsWith("/coordinator") && role !== "COORDINATOR") {
			return NextResponse.redirect(new URL("/admin/dashboard", req.url));
		}
		if (pathname === "/login") {
			if (role === "ADMIN")
				return NextResponse.redirect(new URL("/admin/dashboard", req.url));
			if (role === "COORDINATOR")
				return NextResponse.redirect(
					new URL("/coordinator/dashboard", req.url),
				);
		}
		if (pathname === "/") {
			if (role === "ADMIN")
				return NextResponse.redirect(new URL("/admin/dashboard", req.url));
			if (role === "COORDINATOR")
				return NextResponse.redirect(
					new URL("/coordinator/dashboard", req.url),
				);
			return NextResponse.redirect(new URL("/login", req.url));
		}
	}
});

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
