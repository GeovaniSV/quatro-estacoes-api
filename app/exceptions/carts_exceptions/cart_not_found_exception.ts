import HTTPNotFoundException from '../http_exceptions/HTTP_not_found_exception.js'

export class CartNotFoundException extends HTTPNotFoundException {
  constructor() {
    super('Cart not found')
  }
}
