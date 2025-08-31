export interface GoogleLoginResponse {
  client_id: string;
  redirect_uri: string;
  response_type: string;
  scope: string;
  access_token: string;
  expires_in: number;
  id_token: string;
}
