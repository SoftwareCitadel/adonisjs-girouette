import { RouteMatcher } from '@adonisjs/core/types/http'
import { REFLECT_ROUTES_KEY } from '../constants.js'

/**
 * Decorator for defining route constraints in AdonisJS v6
 * This decorator allows you to add constraints to route parameters,
 * ensuring that the parameter matches a specific pattern before the route is matched.
 *
 * @param key The name of the route parameter to constrain
 * @param matcher The constraint to apply. Can be a string, RegExp, or a custom RouteMatcher function
 * @returns A decorator function
 *
 * @example
 * // In an AdonisJS v6 controller:
 * import { Where } from '@softwarecitadel/girouette'
 *
 * class UsersController {
 *   @Get('/users/:id')
 *   @Where('id', /^\d+$/)
 *   async show({ params }: HttpContext) {
 *     // This route will only match if the 'id' parameter consists of one or more digits
 *   }
 * }
 *
 * @example
 * // Using a custom RouteMatcher function:
 * import { Where } from '@softwarecitadel/girouette'
 *
 * class PostsController {
 *   @Get('/posts/:slug')
 *   @Where('slug', (value) => /^[a-z0-9-]+$/.test(value))
 *   async show({ params }: HttpContext) {
 *     // This route will only match if the 'slug' parameter consists of lowercase letters, numbers, and hyphens
 *   }
 * }
 */
export const Where = (key: string, matcher: RouteMatcher | string | RegExp) => {
  return (target: any, propertyKey: string) => {
    let routes = Reflect.getMetadata(REFLECT_ROUTES_KEY, target) || {}
    const newWhere = { key, matcher }
    if (!routes[propertyKey]) {
      routes[propertyKey] = {}
    }
    if (!routes[propertyKey].where) {
      routes[propertyKey].where = [newWhere]
    } else {
      routes[propertyKey].where.push(newWhere)
    }
    Reflect.defineMetadata(REFLECT_ROUTES_KEY, routes, target)
  }
}
