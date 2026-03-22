import vine from '@vinejs/vine'
import { cpfRule } from './customRules/cpf_validator.js'

const createUserRequestBody = vine.compile(
  vine.object({
    userName: vine.string().trim(),
    email: vine.string().trim().email(),
    password: vine.string(),
    cpf: vine.string().trim().use(cpfRule()),
    fone: vine.string().trim(),
  })
)

const userAddress = vine.compile(
  vine.object({
    cep: vine.string().trim(),
    estado: vine.string(),
    cidade: vine.string(),
    bairro: vine.string(),
    logradouro: vine.string(),
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

const userFilterValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).optional(),
    email: vine.string().trim().email().optional(),
    cpf: vine.string().trim().use(cpfRule()).optional(),
  })
)

export {
  createUserRequestBody,
  updateUserValidator,
  loginUserValidator,
  userAddress,
  userFilterValidator,
}
