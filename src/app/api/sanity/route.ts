import { cookies } from 'next/headers';
import { authService } from "../authService";

export async function GET() {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('authCookie')?.value;
    const userEmail = authCookie ? authService.getEmailFromAuthCookie(authCookie) : null;
    
    if (userEmail) {
        console.log("sanity user: ", userEmail);
        return new Response("User email: " + userEmail, { status: 201 });
    }
    console.log("sanity no user");
    return new Response("No user email", { status: 200 });
}