import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller')
const ProfileController = () => import('#controllers/profiles_controller')
const CartsController = () => import('#controllers/carts_controller')
const ItemsController = () => import('#controllers/items_controller')

router
  .group(() => {
    //users routes
    router
      .group(() => {
        //User profile routes
        router.put('/', [UsersController, 'update'])

        //profile routes
        router.get('/profile', [ProfileController, 'show'])
        router.put('/profile', [ProfileController, 'update'])

        //Cart routes
        router.get('/carts', [CartsController, 'show'])
        router.put('/carts', [CartsController, 'update'])
      })
      .prefix('users')

    //Items routes
    router
      .group(() => {
        router.post('/', [ItemsController, 'store'])
        router.put('/:id', [ItemsController, 'update'])
        router.delete('/:id', [ItemsController, 'destroy'])
      })
      .prefix('items')
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )
