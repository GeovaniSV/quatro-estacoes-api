import HTTPNotFoundException from '../http_exceptions/HTTP_not_found_exception.js'

export class ProductNotFoundException extends HTTPNotFoundException {
  constructor() {
    super('Product not found')
  }
}
