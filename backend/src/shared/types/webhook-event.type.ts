export type WebhookEventType = {
  id: string;
  type: string;
  created: number;
  data: {
    object: any;
  };
};
