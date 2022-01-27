export interface User {
  login: string;
  avatar_url: string;
  followers: number;
  following: number;
}

export interface Message {
  id: string;
  content: string;
  created_at: string;
  user: User;
}