import { FastifyInstance } from 'fastify';
import { routeEntryComments } from './comment';
import { routeCreateEntry } from './create_entry';
import { routeGetEntry } from './get_entry';
import { routeListEntries } from './list_entries';
import { routeReportEntry } from './report_entry';
import { routeVoteOnEntry } from './vote_entry';

export async function routeEntry(server: FastifyInstance) {
  await routeListEntries(server);
  await routeGetEntry(server);
  await routeCreateEntry(server);
  await routeVoteOnEntry(server);
  await routeEntryComments(server);
  await routeReportEntry(server);
}
