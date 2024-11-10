export type ViewState<T> =
  | { type: 'LOADING' }
  | { type: 'SUCCESS'; data: T }
  | { type: 'EMPTY'; msg: string }
  | { type: 'ERROR'; msg: string; code: number; err?: Error; errResponse?: ErrorResponse; data?: T };

export interface ErrorResponse {
  code?: number;
  code_type?: string;
  code_message?: string;
  data?: string;
}