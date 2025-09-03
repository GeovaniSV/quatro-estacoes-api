import { v7 as uuidv7 } from 'uuid'

import User from '#models/user'
import UserAlreadyExistsException from '#exceptions/user_already_exists_exception'
import NotFoundException from '#exceptions/not_found_exception'

export class UserService {
  async create(data: Partial<User>) {
    const hasUser = await User.findBy('email', data.email)
    //tem que tirar os pontos e caracteres especiais do cpf,
    if (hasUser) throw new UserAlreadyExistsException()

    const user = await User.create(data)

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
      throw new NotFoundException('User not found')
    }
  }

  async delete(id: number) {
    const user = await User.findBy('id', id)

    if (user) {
      await user.delete()
      return user
    } else {
      throw new NotFoundException('User not found')
    }
  }
}
