import { FastifyInstance } from 'fastify';
import { routeGetEntry } from './get_entry';
import { routeListEntries } from './list_entries';

export async function routeEntry(server: FastifyInstance) {
  await routeListEntries(server);
  await routeGetEntry(server);
}
