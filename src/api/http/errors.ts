import axios, { AxiosError } from 'axios';

export type AppErrorCode =
  | 'CANCELLED'
  | 'HTTP_ERROR'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'UNKNOWN_ERROR';

export class AppError extends Error {
  code: AppErrorCode;
  status?: number;
  details?: unknown;

  constructor(
    message: string,
    code: AppErrorCode,
    options?: { status?: number; details?: unknown },
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = options?.status;
    this.details = options?.details;
  }
}

export function normalizeHttpError(error: unknown): AppError {
  if (axios.isCancel(error)) {
    return new AppError('La solicitud fue cancelada.', 'CANCELLED');
  }

  if (error instanceof AppError) {
    return error;
  }

  if (
    error &&
    typeof error === 'object' &&
    'name' in error &&
    error.name === 'CanceledError'
  ) {
    return new AppError('La solicitud fue cancelada.', 'CANCELLED');
  }

  if (
    error &&
    typeof error === 'object' &&
    'name' in error &&
    error.name === 'AbortError'
  ) {
    return new AppError('La solicitud fue cancelada.', 'CANCELLED');
  }

  if (axios.isAxiosError(error)) {
    return mapAxiosError(error);
  }

  return new AppError('Ocurrio un error inesperado.', 'UNKNOWN_ERROR', {
    details: error,
  });
}

function mapAxiosError(error: AxiosError): AppError {
  if (error.code === 'ECONNABORTED') {
    return new AppError(
      'La solicitud excedio el tiempo de espera.',
      'TIMEOUT',
      {
        details: error.toJSON(),
      },
    );
  }

  if (error.response) {
    const status = error.response.status;
    const defaultMessage =
      status >= 500
        ? 'El servidor no pudo responder correctamente.'
        : 'La solicitud no pudo completarse.';

    return new AppError(defaultMessage, 'HTTP_ERROR', {
      status,
      details: error.response.data,
    });
  }

  if (error.request) {
    return new AppError(
      'No fue posible conectarse. Verifique su conexion a internet.',
      'NETWORK_ERROR',
      { details: error.toJSON() },
    );
  }

  return new AppError(
    error.message || 'Ocurrio un error inesperado.',
    'UNKNOWN_ERROR',
    {
      details: error.toJSON(),
    },
  );
}

export function getReadableErrorMessage(error: unknown): string {
  const normalizedError = normalizeHttpError(error);
  return normalizedError.message;
}
