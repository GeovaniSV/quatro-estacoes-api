import HTTPAlreadyExistsException from '#exceptions/http_exceptions/HTTP_already_exists_exception'

export class UserAlreadyExistsException extends HTTPAlreadyExistsException {
  constructor() {
    super('User already exists')
  }
}
