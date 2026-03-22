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

const productFilterValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).optional(),

    min_price: vine.number().positive().optional(),
    max_price: vine.number().positive().optional(),

    page: vine.number().min(1).optional(),
    per_page: vine.number().min(1).max(100).optional(),
  })
)

export {
  createProductValidator,
  updateProductValidator,
  uploadImageValidator,
  openApiCreateProductValidator,
  productFilterValidator,
}
