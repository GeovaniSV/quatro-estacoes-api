import HTTPBadRequestException from '#exceptions/http_exceptions/http_bad_request_exception'

HTTPBadRequestException

export class UserInvalidCredentialsException extends HTTPBadRequestException {
  constructor() {
    super('User invalid credentials')
  }
}
