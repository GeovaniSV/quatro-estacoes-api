import HTTPAlreadyExistsException from '#exceptions/http_exceptions/HTTP_already_exists_exception'

export class ProductAlreadyExistsException extends HTTPAlreadyExistsException {
  constructor() {
    super('Product already exists')
  }
}
