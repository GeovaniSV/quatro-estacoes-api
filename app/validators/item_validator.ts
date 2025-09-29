import vine from '@vinejs/vine'

const createItemValidator = vine.compile(
  vine.object({
    productId: vine.number(),
    productQuantity: vine.number(),
    productColor: vine.string(),
  })
)

const updateItemValidator = vine.compile(
  vine.object({
    productQuantity: vine.number().optional(),
    productColor: vine.string().optional(),
  })
)

export { createItemValidator, updateItemValidator }
