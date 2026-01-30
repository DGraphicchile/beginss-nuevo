export interface CafecitoEvent {
  id: string;
  title: string;
  description: string;
  type: 'virtual' | 'presencial';
  date: string;
  time: string;
  location?: string;
  category?: string;
  tags?: string[];
  host: {
    name: string;
    avatar: string;
    bio: string;
  };
  participants: number;
  maxParticipants: number;
  image: string;
  translationKey?: string;
}
