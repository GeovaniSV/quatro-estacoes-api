import vine from '@vinejs/vine'

const createItemValidator = vine.compile(
  vine.object({
    product_id: vine.number(),
    product_quantity: vine.number(),
    product_color: vine.string(),
  })
)

export { createItemValidator }
