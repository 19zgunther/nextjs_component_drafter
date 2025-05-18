import { authService } from "../authService";
import { cookies } from 'next/headers';

export async function GET() {
    // Get email from auth cookie
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('authCookie');
    authService.logout(authCookie?.value);
}