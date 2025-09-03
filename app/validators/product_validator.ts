import vine from '@vinejs/vine'

const createProductValidator = vine.compile(
  vine.object({
    product_name: vine.string(),
    product_description: vine.string().minLength(3).maxLength(120),
    product_price: vine.number().decimal([0, 4]),
  })
)

const updateProductValidator = vine.compile(
  vine.object({
    product_name: vine.string().optional(),
    product_description: vine.string().minLength(3).maxLength(120).optional(),
    product_price: vine.number().decimal([0, 4]).optional(),
  })
)

export { createProductValidator, updateProductValidator }
