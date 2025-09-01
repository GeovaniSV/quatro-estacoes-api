import { v4 as uuidv4 } from 'uuid'

import User from '#models/user'

export class UserService {
  async getAll() {
    return await User.all()
  }

  async getById(id: number) {
    return await User.findOrFail(id)
  }

  async create(data: Partial<User>) {
    return await User.create(data)
  }

  async update(id: number, data: Partial<User>) {
    const user = await User.findOrFail(id)
    user.merge(data)
    await user.save()
    return user
  }

  async delete(id: number) {
    const user = await User.findOrFail(id)
    await user.delete()
    return { message: 'User deleted successfully' }
  }
}
