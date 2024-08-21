import {
  MiddlewareFn,
  OneOrMore,
  ParsedNamedMiddleware,
  ResourceActionNames,
} from '@adonisjs/core/types/http'
import { REFLECT_RESOURCE_MIDDLEWARE_KEY, REFLECT_ROUTES_KEY } from '../constants.js'

/**
 * Decorator for applying middleware to a route in AdonisJS v6
 * @param middleware The middleware function(s) or parsed named middleware to apply
 * @returns A decorator function
 * @example
 * // In an AdonisJS v6 controller:
 * import { middleware } from '#start/kernel'
 *
 * @Get('/protected-route')
 * @RouteMiddleware([middleware.auth()])
 * async protectedMethod({ response }: HttpContext) {
 *   // This route is now protected by the auth middleware
 * }
 */
export const RouteMiddleware = (middleware: OneOrMore<MiddlewareFn | ParsedNamedMiddleware>) => {
  return (target: any, propertyKey: string) => {
    let routes = Reflect.getMetadata(REFLECT_ROUTES_KEY, target) || {}
    if (!routes[propertyKey]) {
      routes[propertyKey] = {}
    }
    if (!routes[propertyKey].middleware) {
      routes[propertyKey].middleware = [middleware]
    } else {
      routes[propertyKey].middleware.push(middleware)
    }
    Reflect.defineMetadata(REFLECT_ROUTES_KEY, routes, target)
  }
}

/**
 * Decorator for applying middleware to resource actions in AdonisJS v6
 * @param actions The resource actions to apply the middleware to ('*' for all actions, or an array of specific action names)
 * @param middleware The middleware function(s) or parsed named middleware to apply
 * @returns A decorator function
 * @example
 * // In an AdonisJS v6 resource controller:
 * import { middleware } from '#start/kernel'
 *
 * @ResourceMiddleware('*', [middleware.auth()])
 * export default class UsersController {
 *   // All resource methods in this controller will be protected by the auth middleware
 * }
 *
 * @example
 * // Applying middleware to specific resource actions:
 * import { middleware } from '#start/kernel'
 *
 * @ResourceMiddleware(['store', 'update', 'destroy'], [middleware.auth()])
 * export default class PostsController {
 *   // Only the store, update, and destroy methods will be protected by the auth middleware
 * }
 */
export const ResourceMiddleware = (
  actions: ResourceActionNames | '*' | ResourceActionNames[],
  middleware: OneOrMore<MiddlewareFn | ParsedNamedMiddleware>
) => {
  return (target: any) => {
    const resourceMiddleware = Reflect.getMetadata(REFLECT_RESOURCE_MIDDLEWARE_KEY, target) || []
    resourceMiddleware.push({ actions, middleware })
    Reflect.defineMetadata(REFLECT_RESOURCE_MIDDLEWARE_KEY, resourceMiddleware, target)
  }
}
