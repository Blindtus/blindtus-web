export type User = {
  _id: string;
  email: string;
  username: string;
  roles: string[];
  confirmed?: boolean;
  avatar?: string;
  avatarSettings?: {
    [key: string]: string;
  };
};
