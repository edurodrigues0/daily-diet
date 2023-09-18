import { FastifyInstance } from "fastify";
import { checkUserIdInCookie } from "../middlewares/check-user-id-in-cookie";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import { z } from "zod"

export async function usersRouter(app: FastifyInstance) {
  // Cria um usuario
  
  app.post('/', async (request, response) => {
    const createUsersBodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
      avatar_url: z.string(),
    })

    const { name, email, password, avatar_url } = createUsersBodySchema.parse(
      request.body
    )

    const emailAlredyExist = await knex('users').where({
      email,
    }).first()

    if (emailAlredyExist) {
      return response.status(400).send({ message: 'Email already exists'})
    }

    const id = randomUUID()
    
    await knex('users').insert({
      id: id,
      name,
      email,
      password,
      avatar_url,
      meals_best_record: 0,
      meals_in_diet: 0,
      meals_out_diet: 0,
      meals_total: 0
    })

    response.cookie('sessionId', id, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
    })

    return response.status(201).send()
  })

  // Auth

  app.post('/auth', async (request, response) => {
    const authUsersBodySchema = z.object({
      email: z.string(),
      password: z.string(),
    })

    const { email, password } = authUsersBodySchema.parse(
      request.body
    )

    const userCredentials = await knex('users').where({ email, password }).first()

    if (!userCredentials) {
      return response.status(400).send({ message: 'Email or password incorrect' })
    }

    const { id } = userCredentials

    response.cookie('sessionId', id, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
    })
    
    return response.status(200).send()
  })

  // Lista usuarios
  
  app.get('/', async (request, response) => {
    const users = await knex("users")
      .select()

    return {
      users,
    }
  })

  // Deleta Usuario
  
  app.delete('/:userId', async (request, response) => {
    const getUsersParamsSchema = z.object({
      userId: z.string().uuid(),
    })
  
    const { userId } = getUsersParamsSchema.parse(request.params)
    
    await knex('users')
      .where({ 
        id: userId,
      })
      .delete()

    response.status(204).send()
  })

  // Lista metricas de um usuario
  
  app.get('/metrics',
  {
    preHandler: [checkUserIdInCookie]
  },
  async (request, response) => {
    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      return
    }

    const metrics = await knex('meals')
      .where({
        user_id: sessionId
      })
      .select([
        knex.raw('count(*) as mealsRegisteredCount'),
        knex.raw('count(CASE WHEN diet_status = ? THEN 1 END) as mealsInDiet', ['in']),
        knex.raw('count(CASE WHEN diet_status = ? THEN 1 END) as mealsOutDiet', ['out']),
      ])

    const mealsBestSequence = await knex('meals')
      .where({
        user_id: sessionId,
      })
      .select()
    
    let record = 0
    let count = 0
    
    mealsBestSequence.map(meal => {
      if (meal.diet_status === 'in') {
        count += 1;
        if (count > record) {
          record = count
        }
      }
      if (meal.diet_status === 'out') {
        count = 0;
      }
    })

    return {
      metrics,
      record
    }
  })
}
