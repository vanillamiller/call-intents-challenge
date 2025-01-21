export interface Intent {
  id: number;
  name: string;
  date: string;
}

export interface Category {
  id: number;
  intentCount: number;
  name: string;
}

export interface IntentsApiResponse {
  id: number;
  name: string;
  intents: Intent[];
}
