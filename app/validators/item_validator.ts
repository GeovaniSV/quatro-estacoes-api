import vine from '@vinejs/vine'

const createItemValidator = vine.compile(
  vine.object({
    product_id: vine.number(),
    product_quantity: vine.number(),
    product_color: vine.string(),
  })
)

const updateItemValidator = vine.compile(
  vine.object({
    product_quantity: vine.number().optional(),
    product_color: vine.string().optional(),
  })
)

export { createItemValidator, updateItemValidator }
