import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import User from '#models/user'

type Query = ModelQueryBuilderContract<typeof User>

interface UserFilters {
  name?: string
  email?: string
  cpf?: string
  page?: number
  per_page?: number
}

class UserFilter {
  constructor(
    private query: Query,
    private filters: UserFilters
  ) {}

  apply(): Query {
    this.filterByName().filterByEmail().filterByCpf()

    return this.query
  }

  private filterByName() {
    if (this.filters.name) {
      this.query.whereLike('user_name', `%${this.filters.name}%`)
    }
    return this
  }

  private filterByEmail() {
    if (this.filters.email) {
      this.query.whereLike('email', `%${this.filters.email}%`)
    }
    return this
  }

  private filterByCpf() {
    if (this.filters.cpf) {
      this.query.whereLike('cpf', `%${this.filters.cpf}%`)
    }
    return this
  }
}
export { UserFilter, type UserFilters }
