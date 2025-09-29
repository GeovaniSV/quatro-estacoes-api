import vine from '@vinejs/vine'

const createCartValidator = vine.compile(
  vine.object({
    user_id: vine.number(),
    cartPrice: vine.number(),
  })
)

const updateCartValidator = vine.compile(
  vine.object({
    cartPrice: vine.number(),
  })
)

export { createCartValidator, updateCartValidator }
