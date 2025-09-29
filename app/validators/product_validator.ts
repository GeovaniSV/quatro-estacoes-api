import vine from '@vinejs/vine'

const createProductValidator = vine.compile(
  vine.object({
    productName: vine.string(),
    productDescription: vine.string().maxLength(120),
    productPrice: vine.number(),
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
    productName: vine.string().optional(),
    productDescription: vine.string().maxLength(120).optional(),
    productPrice: vine.number().optional(),
  })
)

const openApiCreateProductValidator = vine.compile(
  vine.object({
    productName: vine.string(),
    productDescription: vine.string().maxLength(120),
    productPrice: vine.number(),

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
