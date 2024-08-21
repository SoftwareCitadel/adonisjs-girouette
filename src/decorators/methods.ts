import { REFLECT_ROUTES_KEY } from '../constants.js'

/**
 * Creates a method decorator for HTTP routes in AdonisJS v6
 * @param method The HTTP method (e.g., 'GET', 'POST')
 * @returns A decorator function
 */
const MethodDecorator = (method: string) => (pattern: string, name?: string) => {
  return (target: any, key: string) => {
    const routes = Reflect.getMetadata(REFLECT_ROUTES_KEY, target) || {}
    const newRoute = { method, pattern, name }
    routes[key] = routes[key] ? { ...newRoute, ...routes[key] } : newRoute
    Reflect.defineMetadata(REFLECT_ROUTES_KEY, routes, target.constructor)
  }
}

/**
 * Decorator for GET requests in AdonisJS v6
 * @param pattern The route pattern
 * @param name Optional name for the route
 * @example
 * // In an AdonisJS v6 controller:
 * @Get('/users')
 * async index({ response }: HttpContext) {
 *   // Handle GET request for /users
 * }
 */
export const Get = MethodDecorator('GET')

/**
 * Decorator for POST requests in AdonisJS v6
 * @param pattern The route pattern
 * @param name Optional name for the route
 * @example
 * // In an AdonisJS v6 controller:
 * @Post('/users')
 * async store({ request, response }: HttpContext) {
 *   // Handle POST request for /users
 * }
 */
export const Post = MethodDecorator('POST')

/**
 * Decorator for PUT requests in AdonisJS v6
 * @param pattern The route pattern
 * @param name Optional name for the route
 * @example
 * // In an AdonisJS v6 controller:
 * @Put('/users/:id')
 * async update({ params, request, response }: HttpContext) {
 *   // Handle PUT request for /users/:id
 * }
 */
export const Put = MethodDecorator('PUT')

/**
 * Decorator for PATCH requests in AdonisJS v6
 * @param pattern The route pattern
 * @param name Optional name for the route
 * @example
 * // In an AdonisJS v6 controller:
 * @Patch('/users/:id')
 * async partialUpdate({ params, request, response }: HttpContext) {
 *   // Handle PATCH request for /users/:id
 * }
 */
export const Patch = MethodDecorator('PATCH')

/**
 * Decorator for DELETE requests in AdonisJS v6
 * @param pattern The route pattern
 * @param name Optional name for the route
 * @example
 * // In an AdonisJS v6 controller:
 * @Delete('/users/:id')
 * async destroy({ params, response }: HttpContext) {
 *   // Handle DELETE request for /users/:id
 * }
 */
export const Delete = MethodDecorator('DELETE')

/**
 * Decorator for handling any HTTP method in AdonisJS v6
 * @param pattern The route pattern
 * @param name Optional name for the route
 * @example
 * // In an AdonisJS v6 controller:
 * @Any('/wildcard')
 * async handleAnyMethod({ request, response }: HttpContext) {
 *   // Handle any HTTP method for /wildcard
 * }
 */
export const Any = MethodDecorator('ANY')
