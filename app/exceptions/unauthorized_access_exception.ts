import HTTPUnauthorized from './http_exceptions/HTTP_unauthorized_exceptions.js'

export class UnauthorizedException extends HTTPUnauthorized {
  constructor() {
    super('Unauthorized access')
  }
}
