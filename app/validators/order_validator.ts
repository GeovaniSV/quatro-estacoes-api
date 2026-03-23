import vine from '@vinejs/vine'

const updateOrder = vine.compile(
  vine.object({
    status: vine.enum(['em andamento', 'finalizado']),
  })
)

const orderFiltersValidator = vine.compile(
  vine.object({
    price: vine.number().optional(),
    status: vine.enum(['em andamento', 'finalizado']).optional(),
    cpf: vine.string().optional(),
    order: vine.enum(['asc', 'desc']).optional(),
    page: vine.number().optional(),
    per_page: vine.number().optional(),
  })
)

export { updateOrder, orderFiltersValidator }
