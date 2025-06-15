import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Cek jika user mengakses halaman utama
    if (request.nextUrl.pathname === "/") {
        // Ambil token dari cookie (misal: 'token')
        const token = request.cookies.get('token')?.value

        // Jika tidak ada token, redirect ke /auth
        if (!token) {
            const url = request.nextUrl.clone()
            url.pathname = '/auth'
            return NextResponse.redirect(url)
        }
    }

    // Lanjutkan request jika sudah login atau bukan halaman utama
    return NextResponse.next()
}

// Middleware hanya berjalan di halaman utama
export const config = {
    matcher: ["/"],
}