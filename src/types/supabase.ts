export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      comments: {
        Row: {
          content: string | null;
          created_at: string;
          id: string;
          post_id: string | null;
          user_id: string | null;
        };
        Insert: {
          content?: string | null;
          created_at?: string;
          id?: string;
          post_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          content?: string | null;
          created_at?: string;
          id?: string;
          post_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      matePostPets: {
        Row: {
          age: string | null;
          characteristics: string | null;
          created_at: string;
          id: string;
          male_female: string | null;
          neutered: boolean | null;
          post_id: string | null;
          weight: number | null;
        };
        Insert: {
          age?: string | null;
          characteristics?: string | null;
          created_at?: string;
          id: string;
          male_female?: string | null;
          neutered?: boolean | null;
          post_id?: string | null;
          weight?: number | null;
        };
        Update: {
          age?: string | null;
          characteristics?: string | null;
          created_at?: string;
          id?: string;
          male_female?: string | null;
          neutered?: boolean | null;
          post_id?: string | null;
          weight?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "matePostPets_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "matePosts";
            referencedColumns: ["id"];
          }
        ];
      };
      matePosts: {
        Row: {
          address: string | null;
          content: string | null;
          created_at: string;
          date_time: string | null;
          id: string;
          members: string | null;
          place_name: string | null;
          position: Json | null;
          preferred_route: string | null;
          recruiting: boolean | null;
          recruitment_end: string | null;
          recruitment_start: string | null;
          special_requirements: string | null;
          title: string | null;
          user_id: string | null;
        };
        Insert: {
          address?: string | null;
          content?: string | null;
          created_at?: string;
          date_time?: string | null;
          id?: string;
          members?: string | null;
          place_name?: string | null;
          position?: Json | null;
          preferred_route?: string | null;
          recruiting?: boolean | null;
          recruitment_end?: string | null;
          recruitment_start?: string | null;
          special_requirements?: string | null;
          title?: string | null;
          user_id?: string | null;
        };
        Update: {
          address?: string | null;
          content?: string | null;
          created_at?: string;
          date_time?: string | null;
          id?: string;
          members?: string | null;
          place_name?: string | null;
          position?: Json | null;
          preferred_route?: string | null;
          recruiting?: boolean | null;
          recruitment_end?: string | null;
          recruitment_start?: string | null;
          special_requirements?: string | null;
          title?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "matePosts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      messages: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          receiver_id: string | null;
          sender_id: string | null;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          receiver_id?: string | null;
          sender_id?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          receiver_id?: string | null;
          sender_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey";
            columns: ["receiver_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      posts: {
        Row: {
          category: string;
          content: string | null;
          created_at: string;
          id: string;
          post_imageURL: string | null;
          title: string | null;
          user_id: string | null;
        };
        Insert: {
          category: string;
          content?: string | null;
          created_at?: string;
          id?: string;
          post_imageURL?: string | null;
          title?: string | null;
          user_id?: string | null;
        };
        Update: {
          category?: string;
          content?: string | null;
          created_at?: string;
          id?: string;
          post_imageURL?: string | null;
          title?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      users: {
        Row: {
          age: string | null;
          created_at: string;
          email: string | null;
          gender: string | null;
          id: string;
          introduction: string | null;
          mbti: string | null;
          nickname: string | null;
          profile_img: string | null;
        };
        Insert: {
          age?: string | null;
          created_at?: string;
          email?: string | null;
          gender?: string | null;
          id?: string;
          introduction?: string | null;
          mbti?: string | null;
          nickname?: string | null;
          profile_img?: string | null;
        };
        Update: {
          age?: string | null;
          created_at?: string;
          email?: string | null;
          gender?: string | null;
          id?: string;
          introduction?: string | null;
          mbti?: string | null;
          nickname?: string | null;
          profile_img?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "users_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      usersPet: {
        Row: {
          age: string | null;
          created_at: string;
          id: string;
          introduction: string | null;
          majorClass: string | null;
          male_female: string | null;
          medicalRecords: string | null;
          minorClass: string | null;
          neutralized: string | null;
          petImage: string | null;
          petName: string | null;
          users_id: string;
          weight: number | null;
        };
        Insert: {
          age?: string | null;
          created_at?: string;
          id?: string;
          introduction?: string | null;
          majorClass?: string | null;
          male_female?: string | null;
          medicalRecords?: string | null;
          minorClass?: string | null;
          neutralized?: string | null;
          petImage?: string | null;
          petName?: string | null;
          users_id?: string;
          weight?: number | null;
        };
        Update: {
          age?: string | null;
          created_at?: string;
          id?: string;
          introduction?: string | null;
          majorClass?: string | null;
          male_female?: string | null;
          medicalRecords?: string | null;
          minorClass?: string | null;
          neutralized?: string | null;
          petImage?: string | null;
          petName?: string | null;
          users_id?: string;
          weight?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "usersPet_users_id_fkey";
            columns: ["users_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_mate_post_with_pets: {
        Args: {
          post_data: Json;
          pets_data: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"]) | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;
