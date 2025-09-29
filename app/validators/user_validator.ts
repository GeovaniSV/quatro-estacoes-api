import vine from '@vinejs/vine'
import { cpfRule } from './customRules/cpf_validator.js'

const createUserRequestBody = vine.compile(
  vine.object({
    user: vine.object({
      userName: vine.string().trim(),
      email: vine.string().trim().email(),
      password: vine.string(),
      cpf: vine.string().trim().use(cpfRule()),
      fone: vine.string().trim(),
    }),
    profile: vine.object({
      cep: vine.string().trim(),
      estado: vine.string(),
      cidade: vine.string(),
      bairro: vine.string(),
      logradouro: vine.string(),
    }),
  })
)

const updateUserValidator = vine.compile(
  vine.object({
    userName: vine.string().trim(),
    fone: vine.string().trim(),
  })
)

const loginUserValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string(),
  })
)

export { createUserRequestBody, updateUserValidator, loginUserValidator }
