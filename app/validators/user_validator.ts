import vine from '@vinejs/vine'
import { cpfRule } from './customRules/cpf_validator.js'

const createUserValidator = vine.compile(
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

const updateUserValidator = vine.compile(
  vine.object({
    user_name: vine.string().trim(),
    password: vine.string(),
    fone: vine.string().trim(),
    cep: vine.string().trim(),
    estado: vine.string(),
    cidade: vine.string(),
    bairro: vine.string(),
    logradouro: vine.string(),
  })
)

const loginUserValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string(),
  })
)

export { createUserValidator, updateUserValidator, loginUserValidator }
