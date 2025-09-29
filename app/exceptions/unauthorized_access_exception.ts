import HTTPUnauthorizedException from './http_exceptions/HTTP_unauthorized_exceptions.js'

export class UnauthorizedException extends HTTPUnauthorizedException {
  constructor() {
    super('Unauthorized access')
  }
}
