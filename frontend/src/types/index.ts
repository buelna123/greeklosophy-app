export interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;  
  tags?: string;    
  created_at?: string;
  updated_at?: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  image: string;
  category: string; 
  tags?: string; 
  date: string;   
  created_at?: string;
  updated_at?: string;
}
