import vine from '@vinejs/vine'

const updateProfileValidator = vine.compile(
  vine.object({
    cep: vine.string().trim(),
    estado: vine.string(),
    cidade: vine.string(),
    bairro: vine.string(),
    logradouro: vine.string(),
  })
)

export { updateProfileValidator }
