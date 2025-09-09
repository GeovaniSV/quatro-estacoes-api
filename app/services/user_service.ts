import hash from '@adonisjs/core/services/hash'

//models
import User from '#models/user'
import Cart from '#models/cart'

//exceptions
import { UserNotFoundException } from '#exceptions/users_exceptions/user_not_found_exception'
import { UserAlreadyExistsException } from '#exceptions/users_exceptions/user_already_exists_exception'
import { UserInvalidCredentialsException } from '#exceptions/users_exceptions/user_invalid_credentials_exceptions'

//validators
import { createCartValidator } from '#validators/cart_validator'

export class UserService {
  async create(data: Partial<User>) {
    const hasUser = await User.findBy('email', data.email)

    if (hasUser) throw new UserAlreadyExistsException()

    const user = await User.create(data)

    const cartData = {
      user_id: Number(user.id),
      cart_price: 0.0,
    }

    const cartPayload = await createCartValidator.validate(cartData)

    await Cart.create(cartPayload)

    return user
  }

  async login(data: Partial<User>) {
    if (!data.email || !data.password) throw new UserInvalidCredentialsException()
    const user = await User.verifyCredentials(data.email, data.password)

    const ability = {
      role: 'USER',
    }

    if (user.email == 'maniyt60@gmail.com') {
      ability.role = 'ADM'
    }

    const token = await User.accessTokens.create(user, [ability.role])

    return {
      token,
    }
  }

  async getAll() {
    const users = await User.all()
    if (!users || users.length == 0) throw new UserNotFoundException()
    return users
  }

  async getById(id: number) {
    return await User.findOrFail(id)
  }

  async update(id: number, data: Partial<User>) {
    const user = await User.findBy('id', id)

    if (user) {
      user.merge(data)
      await user.save()
      return user
    } else {
      throw new UserNotFoundException()
    }
  }

  async delete(id: number) {
    const user = await User.findBy('id', id)

    if (user) {
      await user.delete()
      return user
    } else {
      throw new UserNotFoundException()
    }
  }
}
