import { REFLECT_RESOURCE_KEY, REFLECT_RESOURCE_NAME_KEY } from '../constants.js'

/**
 * Decorator for defining a resource in AdonisJS v6
 * This decorator is used to mark a controller class as a resource controller,
 * automatically setting up RESTful routes for the resource.
 *
 * @param pattern The base URL pattern for the resource
 * @param name Optional name for the resource routes
 * @returns A decorator function
 *
 * @example
 * // In an AdonisJS v6 resource controller:
 * @Resource('/users')
 * export default class UsersController {
 *   // Resource methods (index, show, store, update, destroy) go here
 * }
 *
 * @example
 * // With a custom name:
 * @Resource('/posts', 'blog.posts')
 * export default class PostsController {
 *   // This will create named routes like 'blog.posts.index', 'blog.posts.show', etc.
 * }
 */
export const Resource = (pattern: string, name?: string) => {
  return (target: any) => {
    Reflect.defineMetadata(REFLECT_RESOURCE_KEY, pattern, target)
    if (name) {
      Reflect.defineMetadata(REFLECT_RESOURCE_NAME_KEY, name, target)
    }
  }
}
