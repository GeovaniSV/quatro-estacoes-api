import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

//services
import { ItemService } from '#services/item_service'

//validators
import { createItemValidator, updateItemValidator } from '#validators/item_validator'

//exceptions
import { UnauthorizedException } from '#exceptions/unauthorized_access_exception'

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
  async show({ params, response }: HttpContext) {
    const item = await this.itemService.show(params.id)

    return response.ok({ data: item })
  }

  //update item
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateItemValidator)
    const item = await this.itemService.update(params.id, payload)

    return response.ok({ data: item })
  }

  //delete item
  async destroy({ params, response }: HttpContext) {
    const item = await this.itemService.delete(params.id)

    response.ok({ data: item })
  }
}
