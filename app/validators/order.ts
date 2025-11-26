import vine from '@vinejs/vine'

const updateOrder = vine.compile(
  vine.object({
    status: vine.enum(['em andamento', 'finalizado']),
  })
)

export { updateOrder }
