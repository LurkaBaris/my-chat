export { authProxy as proxy } from '@/_app/proxy/proxy'

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
