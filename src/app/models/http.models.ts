export enum HttpContentType {
  X_WWW_ENCODED = 'application/x-www-form-urlencoded',
  JSON = 'application/json',
}

export interface HttpEndpointUrl {
  url: string | RegExp;
  httpMethods?: HttpMethods[];
}

export type HttpMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'PATCH';

export interface HttpUrlEncodedParams {
  [param: string]: string | number | boolean;
}

export interface HttpRequestParams {
  [param: string]: string | number | boolean | (string | number | boolean)[] | undefined;
}
