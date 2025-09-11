import HTTPNotFoundException from '../http_exceptions/HTTP_not_found_exception.js'

export class ItemNotFoundException extends HTTPNotFoundException {
  constructor() {
    super('Item not found')
  }
}
