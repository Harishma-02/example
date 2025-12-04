export interface IWebhookEvent {
  id: string;
  type: string;
  created: number;
  data: {
    object: any;
  };
}
