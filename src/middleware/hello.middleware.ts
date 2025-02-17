import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export function helloMiddleware(fastify: FastifyInstance): void {
  fastify.addHook(
    'preHandler',
    async (req: FastifyRequest, res: FastifyReply) => {
      if (req.method === 'GET' && req.url === '/notHello') {
        return;
      }
      console.log('hello!');
    },
  );
}
