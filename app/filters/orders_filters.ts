import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import Order from '#models/order'

type Query = ModelQueryBuilderContract<typeof Order>

interface OrderFilters {
  price?: number
  status?: 'em andamento' | 'finalizado'
  cpf?: string
  order?: 'asc' | 'desc'
  page?: number
  per_page?: number
}

class OrderFilter {
  constructor(
    private query: Query,
    private filters: OrderFilters
  ) {}

  apply(): Query {
    this.filterByPrice().filterByStatus().filterByCpf().applySorting()

    return this.query
  }

  private filterByPrice() {
    if (this.filters.price) {
      this.query.where('price', this.filters.price)
    }
    return this
  }

  private filterByStatus() {
    if (this.filters.status) {
      this.query.where('status', this.filters.status)
    }
    return this
  }

  private filterByCpf() {
    if (this.filters.cpf) {
      this.query.whereLike('cpf', `%${this.filters.cpf}%`)
    }
    return this
  }

  private applySorting() {
    if (this.filters.order) {
      this.query.orderBy('id', this.filters.order)
    }
    return this
  }
}
export { OrderFilter, type OrderFilters }
