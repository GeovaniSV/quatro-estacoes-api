import vine from '@vinejs/vine'
import { cpfRule } from './customRules/cpf_validator.js'

export const createUserValidator = vine.compile(
  vine.object({
    user_name: vine.string().trim(),
    email: vine.string().trim().email(),
    password: vine.string(),
    cpf: vine.string().trim().use(cpfRule()),
    fone: vine.string().trim(),
    cep: vine.string().trim(),
    estado: vine.string(),
    cidade: vine.string(),
    bairro: vine.string(),
    logradouro: vine.string(),
  })
)
