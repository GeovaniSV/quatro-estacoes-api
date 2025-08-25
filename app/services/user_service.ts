import User from '#models/user'

import { CartService } from './cart_service.js'

const cartService = new CartService()

export class UserService {
  async createUser(data: Partial<User>) {
    const user = await User.create({
      user_name: data.user_name,
      email: data.email,
      password: data.password,
      cpf: data.cpf,
      fone: data.fone,
      cep: data.cep,
      estado: data.estado,
      cidade: data.cidade,
      bairro: data.bairro,
      logradouro: data.logradouro,
    })
    const cart = await cartService.createCart()

    return {
      user,
      cart,
    }
  }
}
