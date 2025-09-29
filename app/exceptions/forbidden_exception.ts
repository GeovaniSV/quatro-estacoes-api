import HTTPForbiddenException from './http_exceptions/HTTP_forbidden_exception.js'

export class ForbiddenException extends HTTPForbiddenException {
  constructor() {
    super('Forbidden')
  }
}
