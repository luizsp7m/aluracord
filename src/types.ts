export interface User {
  login: string;
  avatar_url: string;
  name: string;
  followers: number;
  following: number;
  public_repos: number;
}

export interface Message {
  id: string;
  content: string;
  created_at: string;
  user: User;
}