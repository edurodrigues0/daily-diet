// eslint-disable-next-line
import { Knex } from 'knex'

declare module "knex/types/tables" {
  export interface Tables {
    users: {
      id: string;
      name: string;
      email: string;
      password: string;
      avatar_url: string;
      created_at: string;
      meals_out_diet: number;
      meals_in_diet: number;
      meals_total: number;
      meals_best_record: number;
    }
  }
  
  export interface Tables {
    meals: {
      id: string;
      name: string;
      description: string;
      diet_status: enum['in' | 'out']
      created_at: string;
      user_id: string;
    };
  }
}
