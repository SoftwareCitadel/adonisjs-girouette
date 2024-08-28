import 'reflect-metadata'
import type { ApplicationService, HttpRouterService } from '@adonisjs/core/types'
import { cwd } from 'node:process'
import { join } from 'node:path'
import { readdir } from 'node:fs/promises'
import {
  MiddlewareFn,
  OneOrMore,
  ParsedNamedMiddleware,
  RouteMatcher,
} from '@adonisjs/core/types/http'
import {
  REFLECT_RESOURCE_KEY,
  REFLECT_RESOURCE_MIDDLEWARE_KEY,
  REFLECT_RESOURCE_NAME_KEY,
  REFLECT_ROUTES_KEY,
} from '../src/constants.js'

type GirouetteRoute = {
  method: string
  pattern: string
  name: string
  where: { key: string; matcher: RouteMatcher | string | RegExp }[]
  middleware: OneOrMore<MiddlewareFn | ParsedNamedMiddleware>[]
}

export default class GirouetteProvider {
  #router: HttpRouterService | null = null

  constructor(protected app: ApplicationService) {}

  async start() {
    this.#router = await this.app.container.make('router')
    await this.#register(join(cwd(), 'app'))
  }

  async #register(directory: string) {
    const files = await readdir(directory, { withFileTypes: true })
    for (const file of files) {
      const fullPath = join(directory, file.name)
      if (file.isDirectory()) {
        await this.#register(fullPath)
      } else if (
        file.isFile() &&
        (file.name.endsWith('_controller.ts') || file.name.endsWith('_controller.js'))
      ) {
        const controller = await import(fullPath)
        const routes = Reflect.getMetadata(REFLECT_ROUTES_KEY, controller.default)
        if (routes) {
          for (const route in routes) {
            this.#registerRoute(controller, route, routes[route])
          }
        }
        this.#registerResource(controller)
      }
    }
  }

  #registerRoute(controller: any, controllerMethodName: string, route: GirouetteRoute) {
    const { method, pattern, name, where, middleware } = route
    const adonisRoute = this.#router!.route(
      pattern,
      [method],
      [controller.default, controllerMethodName]
    )
    if (name) {
      adonisRoute.as(name)
    }
    if (where) {
      for (const w of where) {
        adonisRoute.where(w.key, w.matcher)
      }
    }
    if (middleware) {
      for (const m of middleware) {
        adonisRoute.use(m)
      }
    }
  }

  #registerResource(controller: any) {
    const resourcePattern = Reflect.getMetadata(REFLECT_RESOURCE_KEY, controller.default)
    if (!resourcePattern) {
      return
    }
    const resource = this.#router!.resource(resourcePattern, controller.default)
    const resourceName = Reflect.getMetadata(REFLECT_RESOURCE_NAME_KEY, controller.default)
    if (resourceName) {
      resource.as(resourceName)
    }
    const resourceMiddleware = Reflect.getMetadata(
      REFLECT_RESOURCE_MIDDLEWARE_KEY,
      controller.default
    )
    if (resourceMiddleware) {
      for (const { actions, middleware } of resourceMiddleware) {
        resource.middleware(actions, middleware)
      }
    }
  }
}
