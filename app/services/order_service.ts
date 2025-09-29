import User from '#models/user'
//exception
import { ItemNotFoundException } from '#exceptions/items_exceptions/item_not_found_exception'
import HTTPInternalErrorException from '#exceptions/http_exceptions/HTTP_internal_error_execption'

//mercadopago configuration//
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { inject } from '@adonisjs/core'
import { MoneyManagement } from '../utils/money.js'

const access_token = process.env.MP_TEST_ACCESS_TOKEN

const client = new MercadoPagoConfig({
  accessToken: access_token!,
  options: { timeout: 5000 },
})

const preference = new Preference(client)
//-------------------------------------------------//

//interfaces
type paymentData = {
  id: string
  title: string
  quantity: number
  currency_id: string
  unit_price: number
}[]

@inject()
export class OrderService {
  constructor(protected moneyManagement: MoneyManagement) {}

  async payment(user: Partial<User>) {
    const cart = user.cart
    await cart?.load('items')
    const items = cart?.items
    if (!items) throw new ItemNotFoundException()

    for (let i = 0; i < items?.length; i++) {
      await items[i].load('product')
    }

    let item_body: paymentData = []

    let item_unit_Price
    items.map((item) => {
      item_unit_Price = this.moneyManagement.createPaymentView(item.product.productPrice)
    })
  }
}
