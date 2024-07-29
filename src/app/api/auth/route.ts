// // app/api/auth/[...auth]/route.ts

// import { NextRequest, NextResponse } from "next/server";
// import { createClient } from "@/supabase/client";

// const supabase = createClient();

// export async function POST(request: NextRequest) {
//   const { action, ...data } = await request.json();

//   switch (action) {
//     case "signUp":
//       return handleSignUp(data);
//     case "signIn":
//       return handleSignIn(data);
//     case "signOut":
//       return handleSignOut();
//     case "emailCheck":
//       return handleEmailCheck(data);
//     case "signInWithGoogle":
//       return handleSignInWithGoogle();
//     case "signInWithKakao":
//       return handleSignInWithKakao();
//     default:
//       return NextResponse.json({ error: "Invalid action" }, { status: 400 });
//   }
// }

// async function handleSignUp(data: any) {
//   const { email, password, nickname } = data;

//   try {
//     const { data: user, error } = await supabase.auth.signUp({
//       email: email as string,
//       password
//     });

//     if (error) throw error;

//     const { data: profileData, error: profileError } = await supabase.from("users").upsert([{ email, nickname }]);

//     if (profileError) throw profileError;

//     return NextResponse.json({ user, profileData });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 400 });
//   }
// }

// async function handleSignIn(data: any) {
//   const { email, password } = data;

//   try {
//     const { data: user, error } = await supabase.auth.signInWithPassword({
//       email: email as string,
//       password
//     });

//     if (error) throw error;

//     return NextResponse.json({ user });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 400 });
//   }
// }

// async function handleSignOut() {
//   try {
//     const { error } = await supabase.auth.signOut();
//     if (error) throw error;
//     return NextResponse.json({ success: true });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 400 });
//   }
// }

// async function handleEmailCheck(data: any) {
//   const { email } = data;

//   try {
//     const { data: existingUsers, error: checkError } = await supabase.from("users").select("*").eq("email", email);
//     if (checkError) throw checkError;

//     if (existingUsers.length > 0) {
//       return NextResponse.json({ error: "중복된 이메일입니다." });
//     } else {
//       return NextResponse.json({ success: true });
//     }
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 400 });
//   }
// }

// async function handleSignInWithGoogle() {
//   try {
//     const { data, error } = await supabase.auth.signInWithOAuth({
//       provider: "google",
//       options: {
//         redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/googleCallback`
//       }
//     });

//     if (error) throw error;

//     return NextResponse.json({ url: data.url });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 400 });
//   }
// }

// async function handleSignInWithKakao() {
//   try {
//     const { data, error } = await supabase.auth.signInWithOAuth({
//       provider: "kakao",
//       options: {
//         redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/kakaoCallback`
//       }
//     });

//     if (error) throw error;

//     return NextResponse.json({ url: data.url });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 400 });
//   }
// }
