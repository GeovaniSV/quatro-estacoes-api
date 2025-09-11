import { UnauthorizedException } from '#exceptions/unauthorized_access_exception'
import { ItemService } from '#services/item_service'
import { createItemValidator } from '#validators/item_validator'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ItemsController {
  constructor(protected itemService: ItemService) {}

  //create new item
  async store({ auth, request, response }: HttpContext) {
    const user = auth.user
    if (!user) throw new UnauthorizedException()
    const payload = await request.validateUsing(createItemValidator)
    const item = await this.itemService.create(payload, user)
    return response.created({ data: item })
  }

  //query all items
  async index({ auth, response }: HttpContext) {
    const user = auth.user
    if (!user) throw new UnauthorizedException()
    const items = await this.itemService.all(user)
    return response.ok({ data: items })
  }

  //show unique item
  async show({ params, response }: HttpContext) {}

  //update item
  async update({ params, request, response }: HttpContext) {}

  //delete item
  async destroy({ params, response }: HttpContext) {}
}
