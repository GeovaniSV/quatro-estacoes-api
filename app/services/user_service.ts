import User from '#models/user'

import { CartService } from './cart_service.js'

export class UserService {
  static async getAll() {
    return await User.all()
  }

  static async getById(id: number) {
    return await User.findOrFail(id)
  }

  static async create(data: Partial<User>) {
    return await User.create(data)
  }

  static async update(id: number, data: Partial<User>) {
    const user = await User.findOrFail(id)
    user.merge(data)
    await user.save()
    return user
  }

  static async delete(id: number) {
    const user = await User.findOrFail(id)
    await user.delete()
    return { message: 'User deleted successfully' }
  }
}
