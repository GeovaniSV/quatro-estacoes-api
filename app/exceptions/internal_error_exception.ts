import HTTPInternalErrorException from './http_exceptions/HTTP_internal_error_execption.js'

export class InternalErrorException extends HTTPInternalErrorException {
  constructor() {
    super('Internal error')
  }
}
