import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class UserAlreadyExistsException extends Exception {
  static status = 409
  static code = 'E_USER_ALREADY_EXISTS'
  static message = 'User already exists'

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send({
      Error: {
        status: error.status,
        message: error.message,
      },
    })
  }
}
