import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createClient();
  const { id } = params;

  try {
    const { data, error } = await supabase
      .from("matePosts")
      .select("*,users(nickname),matePostPets(*)")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ err }, { status: 500 });
  }
};

// export const POST = async (request: NextRequest, { params }: { params: { id: string } }) => {
//   const supabase = createClient();
//   const { id } = params;

//   const newPost = await request.json();
//   console.log(newPost);

//   try {
//     const { data, error } = await supabase
//       .from("matePosts")
//       .insert(newPost)
//       .eq('id', id);

//     if (error) {
//       console.error(error);
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }

//     return NextResponse.json(data);
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ err }, { status: 500 });
//   }
// };

export const PUT = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createClient();
  const { id } = params;

  const updatePost = await request.json();

  try {
    const { data, error } = await supabase.from("matePosts").update(updatePost).eq("id", id);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ err }, { status: 500 });
  }
};

export const DELETE = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createClient();
  const { id } = params;

  try {
    const { data, error } = await supabase.from("matePosts").delete().eq("id", id);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ err }, { status: 500 });
  }
};
