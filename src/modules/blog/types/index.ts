export interface BlogPostTopic {
  id: string;
  name: string;
  color: string;
  url: string;
}

export interface BlogPost {
  title: string;
  description: string;
  coverImageUrl?: string;
  url: string;
  topics: BlogPostTopic[];
}
