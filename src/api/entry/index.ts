import { FakeEntries } from 'common/fakes/fake_entries';
import { FastifyInstance, FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import { routeGetEntry } from './get_entry';
import { routeListEntries } from './list_entries';

export async function routeEntry(server: FastifyInstance) {
  await routeListEntries(server);
  await routeGetEntry(server);
}
