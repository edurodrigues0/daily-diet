import { FastifyInstance } from "fastify";
import { checkUserIdInCookie } from "../middlewares/check-user-id-in-cookie";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import { z } from "zod"

export async function mealsRouter(app: FastifyInstance) {
  // Listar as refeicoes
  app.get('/', 
    {
      preHandler: [checkUserIdInCookie]
    }, 
    async (request) => {
      const { sessionId } = request.cookies

      const meals = await knex("meals")
        .where('user_id', sessionId)
        .select();

        return {
          meals,
        }
  })
  // Mostrar uma unica refeicao pelo id
  app.get('/:id', 
  {
    preHandler: [checkUserIdInCookie]
  },
  async (request) => {
    const getMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealsParamsSchema.parse(request.params)

    const { sessionId } = request.cookies

    const meal = await knex('meals')
      .where({ 
        id,
        user_id: sessionId
      })
      .first()

      return {
        meal
      }
  })
  // Criacao de refeicao
  app.post('/', async (request, response) => {
    const createMealsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      diet_status: z.enum(['in', 'out']),
      created_at: z.string(),
    })
    
    const { name, description, diet_status, created_at } = createMealsBodySchema.parse(
      request.body
    )

    let userId = request.cookies.sessionId

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      diet_status,
      created_at,
      user_id: userId
    })

    return response.status(201).send();
  })
  // Editar a refeicao
  app.patch('/:id', 
  {
    preHandler: [checkUserIdInCookie]
  },
  async (request, response) => {
    const getMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })
    
    const updateMealsBodySchema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      diet_status: z.enum(['in', 'out']).optional(),
      created_at: z.string().optional(),
    })
    
    const { id } = getMealsParamsSchema.parse(request.params)

    const { sessionId } = request.cookies
    
    const { name, description, diet_status, created_at } = updateMealsBodySchema.parse(request.body)

    await knex('meals')
      .where({ 
        id,
        user_id: sessionId
      })
      .first()
      .update({
        name,
        description,
        diet_status,
        created_at
      })

    return response.status(204).send();
  })
  // Remover refeicao
  app.delete('/:id', 
  {
    preHandler: [checkUserIdInCookie]
  },
  async (request, response) => {
    const getMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })
  
    const { id } = getMealsParamsSchema.parse(request.params)

    const { sessionId } = request.cookies

    await knex('meals')
      .where({ 
        id,
        user_id: sessionId
      })
      .delete()

    response.status(204).send()
  })
}