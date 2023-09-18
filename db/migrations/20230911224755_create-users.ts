import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.text('password').notNullable()
    table.text('avatar_url')
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.decimal('meals_total').defaultTo(0)
    table.decimal('meals_in_diet').defaultTo(0)
    table.decimal('meals_out_diet').defaultTo(0)
    table.decimal('meals_best_record').defaultTo(0)
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}

