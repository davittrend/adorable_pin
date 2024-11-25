export interface PinterestAuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number | null;
  isAuthenticated: boolean;
  error: string | null;
}

export interface PinterestPin {
  title: string;
  description: string;
  link: string;
  media_source: {
    url: string;
  };
  board_id: string;
}