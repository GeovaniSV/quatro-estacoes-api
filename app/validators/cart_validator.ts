import vine from '@vinejs/vine'

const createCartValidator = vine.compile(
  vine.object({
    user_id: vine.number(),
    cart_price: vine.number(),
  })
)

const updateCartValidator = vine.compile(
  vine.object({
    cart_price: vine.number(),
  })
)

export { createCartValidator, updateCartValidator }
