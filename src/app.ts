import cookie from "@fastify/cookie";
import fastify from "fastify";
import { mealsRouter } from "./routes/meals";
import { usersRouter } from "./routes/users";

export const app = fastify();

app.register(cookie);

app.register(usersRouter, {
  prefix: "users"
})

app.register(mealsRouter, {
  prefix: "meals"
})
