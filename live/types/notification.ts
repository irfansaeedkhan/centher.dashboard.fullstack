export interface Notify {
  id: string;
  create_at: Date;
  is_sent: boolean;
  is_seen: boolean;
  is_fetched: boolean;
  is_clickable: boolean;
  is_clicked: boolean;
  seen_Date: Date;
  title: string;
  topic: string;
  data: string;
  link: string;
  user_id: string;
  user: any;
}
