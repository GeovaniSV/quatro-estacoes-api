import { v4 as uuidv4 } from 'uuid'

import User from '#models/user'

export class UserService {
  async create(data: Partial<User>) {
    let user = await User.findBy('email', data.email)
    //tem que tirar os pontos e caracteres especiais do cpf,
    if (user) {
      return {
        status: 400,
        message: 'User already exists',
        user,
      }
    }

    user = await User.create(data)

    return {
      status: 201,
      message: 'User created',
      user,
    }
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
      return {
        status: 200,
        message: 'User updated',
        user,
      }
    }

    return {
      status: 404,
      message: 'User not found',
    }
  }

  async delete(id: number) {
    const user = await User.findBy('id', id)

    if (user) {
      await user.delete()
      return {
        status: 200,
        message: 'User deleted successfuly',
      }
    }
    return {
      status: 404,
      message: 'User not found',
    }
  }
}
