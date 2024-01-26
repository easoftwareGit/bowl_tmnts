export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/secret',  
    '/user'
  ]
}

// '/app/:path*'
// will include all sub folders for /app/ and all sub directories