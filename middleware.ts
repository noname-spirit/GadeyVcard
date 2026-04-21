// import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/admin', '/onboarding'];
const AUTH_ROUTES = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  // let supabaseResponse = NextResponse.next({ request });

  // // const supabase = createServerClient(
  // //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  // //   {
  // //     cookies: {
  // //       getAll() {
  // //         return request.cookies.getAll();
  // //       },
  // //       setAll(cookiesToSet) {
  // //         cookiesToSet.forEach(({ name, value }) =>
  // //           request.cookies.set(name, value)
  // //         );
  // //         supabaseResponse = NextResponse.next({ request });
  // //         cookiesToSet.forEach(({ name, value, options }) =>
  // //           supabaseResponse.cookies.set(name, value, options)
  // //         );
  // //       },
  // //     },
  // //   }
  // // );

  // // Refresh session — NE PAS supprimer, requis pour que la session reste valide
  // const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  // Non connecté → tente d'accéder à une route protégée
  // if (!user && isProtected) {
  //   const redirectUrl = request.nextUrl.clone();
  //   redirectUrl.pathname = '/login';
  //   redirectUrl.searchParams.set('redirect', pathname);
  //   return NextResponse.redirect(redirectUrl);
  // }

  // // Connecté → tente d'accéder à /login ou /register
  // if (user && isAuthRoute) {
  //   const redirectUrl = request.nextUrl.clone();
  //   redirectUrl.pathname = '/dashboard';
  //   return NextResponse.redirect(redirectUrl);
  // }

  // return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
