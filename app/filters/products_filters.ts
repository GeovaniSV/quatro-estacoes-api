/* eslint-disable @typescript-eslint/naming-convention */
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import Product from '#models/product'

type Query = ModelQueryBuilderContract<typeof Product>

interface ProductFilters {
  name?: string[]
  min_price?: number
  max_price?: number
  page?: number
  per_page?: number
}

class ProductFilter {
  constructor(
    private query: Query,
    private filters: ProductFilters
  ) {}

  apply(): Query {
    this.filterByName().filterByPrice()

    return this.query
  }

  private filterByName() {
    if (this.filters.name) {
      for (const name of this.filters.name) {
        this.query.orWhere('product_name', 'like', `%${name}%`)
      }
    }
    return this
  }

  private filterByPrice() {
    const { min_price, max_price } = this.filters

    if (min_price !== undefined) {
      this.query.where('product_price', '>=', min_price)
    }
    if (max_price !== undefined) {
      this.query.where('product_price', '<=', max_price)
    }
    return this
  }
}

export { ProductFilter, type ProductFilters }
