export type ApplicationErrorType =
  | 'validation'
  | 'not_found'
  | 'server'
  | 'network'
  | 'timeout'
  | 'unknown';

export interface ApplicationError {
  readonly type: ApplicationErrorType;
  readonly message: string;
  readonly status?: number;
}