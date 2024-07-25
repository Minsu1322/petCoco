import { Tables } from "./supabase";
export type MatePostType = Tables<"matePosts">;
export type MatePostPetsType = Tables<"matePostPets">;

export type MatePostFullType = MatePostType & {
  position: {
    center: {
      lat: number;
      lng: number;
    };
    errMsg: string | null;
    isLoading: boolean;
  };
  users: {
    nickname: string;
  }
}

export type MatePostAllType = MatePostType & {
  position: {
    center: {
      lat: number;
      lng: number;
    };
    errMsg: string | null;
    isLoading: boolean;
  };
  users: {
    nickname: string;
  };
  matePostPets: MatePostPetType[]; 
}

export type MateNextPostType = Omit<MatePostFullType,  'id' | 'created_at' | 'users'>

export type MatePostPetType = {
  post_id?: number; // post_id를 추가
  male_female: string;
  neutered: boolean | null;
  weight: string;
  characteristics: string;
};

export type FormState = MatePostFullType & MatePostPetsType