import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller')
const ProductsController = () => import('#controllers/products_controller')
const OrdersController = () => import('#controllers/orders_controller')

router
  .group(() => {
    //User management routes
    router
      .group(() => {
        router.get('/', [UsersController, 'index'])
        router.get('/:id', [UsersController, 'show'])
        router.delete('/:id', [UsersController, 'destroy'])
      })
      .prefix('users')

    //Product management routes
    router.group(() => {
      router
        .group(() => {
          router.post('/', [ProductsController, 'store'])
          router.put('/:id', [ProductsController, 'update'])
          router.delete('/:id', [ProductsController, 'destroy'])
          router.delete('/:id/:imageId', [ProductsController, 'destroyProductImage'])
        })
        .prefix('products')
    })

    router
      .group(() => {
        router.get('/', [OrdersController, 'index'])
        router.put('/:id', [OrdersController, 'index'])
      })
      .prefix('orders')
  })
  .use([middleware.auth({ guards: ['api'] }), middleware.adminOnly()])
