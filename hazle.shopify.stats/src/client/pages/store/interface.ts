// interface.ts

export interface TrafficData {
    sitename: string;
    description: string;
    store_screenshot: string;
    avg_variant_price: number;
    logo: string;
    top_countries: {
      CountryCode: string;
      Country: string;
      value: number;
    }[];
    monthly_visitors: {
      date: string;
      value: number;
    }[];
    percentage_increase: number;
    traffic_sources: {
      source: string;
      value: number;
      handler: string;
    }[];
  }
  
  export interface TiktokData {
      username: string;
      avatar: string;
      followers: string;
      likes: string;
      videos: string;
      overall_engagement: string;
      likes_engagement: string;
      comments_engagement: string;
      avg_views: string;
      avg_likes: string;
      avg_comments: string;
      hashtags: string[];
      posts: TikTokPost[];
  }
  
  export interface TikTokPost {
    description: string;
    poster: string;
    views: number;
    likes: number;
    comments: number;
    engagement: number;
    created_at: string;
    vph: number;
  }