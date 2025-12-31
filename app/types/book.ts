export interface BookPost {
  _id: string;
  title: string;
  description: string;
  image?: string;
  date?: string;
  badge?: string;
  to: string;
  authors: {
    name: string;
    avatar?: { src: string };
  }[];
  isBookmarked: boolean;
}
