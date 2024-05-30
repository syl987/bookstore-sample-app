export enum HttpContentType {
  X_WWW_ENCODED = 'application/x-www-form-urlencoded',
  JSON = 'application/json',
}

export interface HttpEndpointUrl {
  readonly url: string | RegExp;
  readonly httpMethods?: HttpMethods[];
}

export type HttpMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'PATCH';

export type HttpUrlEncodedParams = Record<string, string | number | boolean>;

export type HttpRequestParams = Record<string, string | number | boolean | (string | number | boolean)[] | undefined>;
