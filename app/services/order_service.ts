import { inject } from '@adonisjs/core'
import { MoneyManagement } from '../utils/money.js'

@inject()
export class OrderService {
  constructor(protected moneyManagement: MoneyManagement) {}
}
