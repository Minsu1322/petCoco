import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createClient();
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: `id is required` }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
    *,
    users (
      *
    ),
    likes (userid)
  `
    )
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
};

export const PUT = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createClient();
  const { id } = params;

  const updatePost = await request.json();

  try {
    const { data, error } = await supabase.from("posts").update(updatePost).eq("id", id);

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

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  try {
    // Delete Image from supabase storage when delete post from database
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .select("post_imageURL")
      .eq("id", id)
      .single();

    if (postError) {
      console.error(postError);
      return NextResponse.json({ error: postError.message }, { status: 500 });
    }

    //post_imageURL is string but, can split by , to get image URL array
    const image = postData.post_imageURL ? postData.post_imageURL.split(",") : [];
    for (let i = 0; i < image.length; i++) {
      //image url need to split by "/storage/v1/object/public/" to get image file location and image file location is array 1st index
      // it's need to null exception handling
      // https://eoxrihspempkfnxziwzd.supabase.co/storage/v1/object/public/post_image/1722371836145_tfyxl.png
      const imageLocationArray = image[i].split("/storage/v1/object/public/post_image/");
      if (imageLocationArray.length < 2) {
        continue;
      }
      const imageLocation = imageLocationArray[1];

      const { error: imageError } = await supabase.storage.from("post_image").remove([imageLocation]);
      if (imageError) {
        console.error(imageError);
        return NextResponse.json({ error: imageError?.message }, { status: 500 });
      }
    }

    const { data, error } = await supabase.from("posts").delete().eq("id", id);

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
