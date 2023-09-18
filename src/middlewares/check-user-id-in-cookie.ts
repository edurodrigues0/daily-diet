import { FastifyReply, FastifyRequest } from "fastify";

export async function checkUserIdInCookie(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.cookies.sessionId;

  if (!userId) {
    return reply.status(401).send({
      error: "Unauthorized.",
    });
  }
}
