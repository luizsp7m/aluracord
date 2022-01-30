export interface User {
  login: string;
  name: string;
  avatar_url: string;
  followers: number;
  following: number;
  public_repos: number;
}

export interface Message {
  id: string;
  content: string;
  created_at: string;
  sender: string;
  updated: boolean;
}

export interface Sticker {
  id: number;
  url: string;
}