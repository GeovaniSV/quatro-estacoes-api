import HTTPForbidden from './http_exceptions/HTTP_forbidden_exception.js'

export class ForbiddenException extends HTTPForbidden {
  constructor() {
    super('Forbidden')
  }
}
