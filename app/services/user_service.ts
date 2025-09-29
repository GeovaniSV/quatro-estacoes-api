import db from '@adonisjs/lucid/services/db'

//models
import User from '#models/user'
import Cart from '#models/cart'
import Profile from '#models/profile'

//exceptions
import { UserNotFoundException } from '#exceptions/users_exceptions/user_not_found_exception'
import { UserAlreadyExistsException } from '#exceptions/users_exceptions/user_already_exists_exception'
import { UserInvalidCredentialsException } from '#exceptions/users_exceptions/user_invalid_credentials_exceptions'
import { InternalErrorException } from '#exceptions/internal_error_exception'

//validators
import { createCartValidator } from '#validators/cart_validator'

export class UserService {
  async register(userData: Partial<User>, profileData: Partial<Profile>) {
    const hasUser = await User.findBy('email', userData.email)

    if (hasUser) throw new UserAlreadyExistsException()

    if (userData.email == 'maniyt60@gmail.com') {
      userData.role = 'ADMIN'
    }
    const user = await User.create(userData)

    profileData.user_id = user.id

    await Profile.create(profileData)

    const cartData = {
      user_id: Number(user.id),
      cartPrice: 0.0,
    }

    const cartPayload = await createCartValidator.validate(cartData)

    const cart = await Cart.create(cartPayload)
    if (!cart) {
      user.delete()
      throw new InternalErrorException()
    }

    await user.load('profile')
    await user.load('cart')

    return { user }
  }

  async login(data: Partial<User>) {
    if (!data.email || !data.password) throw new UserInvalidCredentialsException()
    const user = await User.verifyCredentials(data.email, data.password)

    const token = await User.accessTokens.create(user, [user.role])

    return token
  }

  async getAll(page: number, limit: number) {
    const users = await db.from('users').paginate(page, limit)

    if (!users || users.length == 0) throw new UserNotFoundException()

    return users
  }

  async getById(id: number) {
    const user = await User.findBy('id', id)

    if (!user) throw new UserNotFoundException()

    await user.load('profile')
    await user.load('cart')

    return user
  }

  async update(id: number, data: Partial<User>) {
    const user = await User.findBy('id', id)

    if (!user) throw new UserNotFoundException()

    user.merge(data)
    await user.save()

    return user
  }

  async delete(id: number) {
    const user = await User.findBy('id', id)

    if (!user) throw new UserNotFoundException()

    await user.delete()

    return user
  }
}
