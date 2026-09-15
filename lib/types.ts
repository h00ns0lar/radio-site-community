export type Role = "teacher" | "student";
export type CommunityCategory = "free" | "question" | "tip";
export type PostType = "observation" | "community";

export type Profile = {
  id: string;
  name: string;
  role: Role;
  created_at: string;
};

export type ObservationPost = {
  id: string;
  author_id: string;
  title: string;
  description: string;
  image_urls: string[];
  observed_at: string;
  created_at: string;
  profiles: Profile | null;
};

export type CommunityPost = {
  id: string;
  author_id: string;
  category: CommunityCategory;
  title: string;
  content: string;
  created_at: string;
  profiles: Profile | null;
};

export type Comment = {
  id: string;
  post_type: PostType;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  profiles: Profile | null;
};

export const CATEGORY_LABEL: Record<CommunityCategory, string> = {
  free: "자유",
  question: "질문",
  tip: "노하우공유",
};

export const ROLE_LABEL: Record<Role, string> = {
  teacher: "교사",
  student: "학생",
};
