//models
import User from '#models/user'
import Cart from '#models/cart'

//exceptions
import HTTPAlreadyExistsException from '#exceptions/HTTP_already_exists_exception'
import HTTPNotFoundException from '#exceptions/HTTP_not_found_exception'

//validators
import { createCartValidator } from '#validators/cart_validator'
import vine from '@vinejs/vine'

export class UserService {
  async create(data: Partial<User>) {
    const hasUser = await User.findBy('email', data.email)

    if (hasUser) throw new HTTPAlreadyExistsException('User already exists')

    const user = await User.create(data)

    const cartData = {
      user_id: Number(user.id),
      cart_price: 0.0,
    }

    const cartPayload = await createCartValidator.validate(cartData)

    await Cart.create(cartPayload)

    return user
  }

  async getAll() {
    return await User.all()
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
      throw new HTTPNotFoundException('User not found')
    }
  }

  async delete(id: number) {
    const user = await User.findBy('id', id)

    if (user) {
      await user.delete()
      return user
    } else {
      throw new HTTPNotFoundException('User not found')
    }
  }
}
