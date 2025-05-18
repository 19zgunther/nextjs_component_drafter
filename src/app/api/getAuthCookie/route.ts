import { authService } from "../authService";
import { cookies } from 'next/headers';

// This comes from the Email sent to the user
// verify link will be like http://<url>/api/getAuthCookie?verifyToken=1234567890
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const verifyToken = searchParams.get('verifyToken');
    const authCookie = authService.getAuthCookie(verifyToken);
    
    if (authCookie) {
        console.log("Sending auth cookie");
        const cookieStore = await cookies();
        cookieStore.set('authCookie', authCookie, {
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            maxAge: 86400
        });

        //redirect to /
        return Response.redirect(new URL('/', req.url));
    }
    console.log("NOT Sending auth cookie");
    return Response.redirect(new URL('/', req.url));
}