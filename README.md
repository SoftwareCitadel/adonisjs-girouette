# Girouette

> An AdonisJS package allowing decorator-based routing.

## Installation

```bash
node ace add @softwarecitadel/girouette
```

## Usage

Girouette allows you to define routes using decorators in your AdonisJS v6 controllers. This approach can make your route definitions more intuitive and keep them close to your controller methods.

### Basic Usage

To use Girouette decorators, import them in your controller file:

```typescript
import { Get, Post, Put, Patch, Delete, Any, RouteMiddleware, Resource, Where } from '@softwarecitadel/girouette'
```

Then, you can use these decorators to define routes:

```typescript
import { HttpContext } from '@adonisjs/core/http'
import { Get, Post } from '@softwarecitadel/girouette'

export default class UsersController {
  @Get('/users')
  async index({ response }: HttpContext) {
    // Handle GET request for /users
  }

  @Post('/users')
  async store({ request, response }: HttpContext) {
    // Handle POST request for /users
  }
}
```

### Available Decorators

#### HTTP Method Decorators

- `@Get(pattern: string, name?: string)`
- `@Post(pattern: string, name?: string)`
- `@Put(pattern: string, name?: string)`
- `@Patch(pattern: string, name?: string)`
- `@Delete(pattern: string, name?: string)`
- `@Any(pattern: string, name?: string)`

#### Middleware Decorator

```typescript
import { middleware } from '#start/kernel'
import { Get, RouteMiddleware } from '@softwarecitadel/girouette'

export default class UsersController {
  @Get('/admin/users')
  @RouteMiddleware([middleware.auth()])
  async adminIndex({ response }: HttpContext) {
    // This route is protected by the auth middleware
  }
}
```

#### Resource Decorator

```typescript
import { Resource } from '@softwarecitadel/girouette'

@Resource('/users', 'users')
export default class UsersController {
  // Implement index, show, store, update, and destroy methods
}
```

#### Where Decorator

```typescript
import { Get, Where } from '@softwarecitadel/girouette'

export default class PostsController {
  @Get('/posts/:slug')
  @Where('slug', (value) => /^[a-z0-9-]+$/.test(value))
  async show({ params }: HttpContext) {
    // This route will only match if the 'slug' parameter consists of lowercase letters, numbers, and hyphens
  }
}
```

### Advanced Usage

#### Combining Decorators

You can combine multiple decorators on a single method:

```typescript
import { Get, RouteMiddleware, Where } from '@softwarecitadel/girouette'
import { middleware } from '#start/kernel'

export default class PostsController {
  @Get('/posts/:id')
  @RouteMiddleware([middleware.auth()])
  @Where('id', /^\d+$/)
  async show({ params }: HttpContext) {
    // This route is protected by auth middleware and only matches numeric IDs
  }
}
```

#### Resource Middleware

You can apply middleware to all or specific actions of a resource:

```typescript
import { Resource, ResourceMiddleware } from '@softwarecitedel/girouette'
import { middleware } from '#start/kernel'

@Resource('/admin/posts', 'admin.posts')
@ResourceMiddleware(['store', 'update', 'destroy'], [middleware.auth()])
export default class AdminPostsController {
  // Implement resource methods
  // store, update, and destroy will be protected by auth middleware
}
```

## License

This project is licensed under the [MIT License](./LICENSE.md).
