import vine from '@vinejs/vine'

const createProductValidator = vine.compile(
  vine.object({
    product_name: vine.string(),
    product_description: vine.string().maxLength(120),
    product_price: vine.number(),
  })
)

const updateProductValidator = vine.compile(
  vine.object({
    product_name: vine.string().optional(),
    product_description: vine.string().maxLength(120).optional(),
    product_price: vine.number().optional(),
  })
)

export { createProductValidator, updateProductValidator }
