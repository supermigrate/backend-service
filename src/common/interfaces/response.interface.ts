export interface IResponse {
  statusCode: number;
  [key: string]: Record<string, unknown> | string | number;
}
