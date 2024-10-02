import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic' },
    });
  }

  return NextResponse.next();
}

function isAuthenticated(req: NextRequest) {
  const basicAuth = req.headers.get('authorization') || req.headers.get('Authorization');

  if (!basicAuth) {
    return false;
  }

  const authValue = basicAuth.split(' ')[1]
  const [user, pwd] = atob(authValue).split(':')

  if (user === process.env.BASIC_AUTH_USERNAME && pwd === process.env.BASIC_AUTH_PW) {
    return true
  } else {
    return false
  }
}