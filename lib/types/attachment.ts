export interface JobAttachment {
  public_id: string;
  resource_type: string;
  type?: string;
  format?: string;
  bytes: number;
  original_filename: string;
  uploaded_at: string;
}
