import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller')
const CartsController = () => import('#controllers/carts_controller')

router
  .group(() => {
    //User profile routes
    router.put('/:id', [UsersController, 'update'])

    //Cart routes
    router.get('/:id/carts', [CartsController, 'show'])
    router.put('/:id/carts', [CartsController, 'update'])
  })
  .prefix('users')
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )
