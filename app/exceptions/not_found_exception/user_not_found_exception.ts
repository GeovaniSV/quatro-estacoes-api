import HTTPNotFoundException from '../http_exceptions/HTTP_not_found_exception.js'

export class UserNotFoundException extends HTTPNotFoundException {
  constructor() {
    super('User not found')
  }
}
