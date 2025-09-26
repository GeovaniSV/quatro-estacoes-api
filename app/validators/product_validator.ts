import vine from '@vinejs/vine'

const createProductValidator = vine.compile(
  vine.object({
    product_name: vine.string(),
    product_description: vine.string().maxLength(120),
    product_price: vine.number(),
  })
)

const uploadImageValidator = vine.compile(
  vine.object({
    mainImage: vine.file(),
    images: vine
      .array(
        vine.file({
          extnames: ['png', 'jpg', 'jpeg'],
        })
      )
      .optional(),
  })
)

const updateProductValidator = vine.compile(
  vine.object({
    product_name: vine.string().optional(),
    product_description: vine.string().maxLength(120).optional(),
    product_price: vine.number().optional(),
  })
)

const openApiCreateProductValidator = vine.compile(
  vine.object({
    product_name: vine.string(),
    product_description: vine.string().maxLength(120),
    product_price: vine.number(),

    mainImage: vine.file({
      extnames: ['png', 'jpg', 'jpeg'],
    }),
    images: vine
      .array(
        vine.file({
          extnames: ['png', 'jpg', 'jpeg'],
        })
      )
      .optional(),
  })
)

export {
  createProductValidator,
  updateProductValidator,
  uploadImageValidator,
  openApiCreateProductValidator,
}
