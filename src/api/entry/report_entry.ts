import { ReportEntryRequest } from 'common/types';
import { FastifyInstance, FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import { isValidIssue, isValidReasons } from '../validation';

const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        //
      }
    }
  }
};

export function routeReportEntry(server: FastifyInstance) {
  const collection = server.mongo.db.collection('reported_entries');

  server.post('/entry/:entryId/report', {}, async (req: FastifyRequest, res: FastifyReply) => {
    const { entryId, reportedOn, reasons, issue } = JSON.parse(req.body as string) as ReportEntryRequest;

    // TODO: use proper fastify verification
    if (!isValidReasons(reasons)
      || !isValidIssue(issue)) {
      res.statusCode = 400;
      return;
    }

    const document: ReportEntryRequest = {
      entryId,
      reportedOn,
      reasons,
      issue
    };
    const { insertedId: reportID } = await collection.insertOne({
      ...document,
    });

    return JSON.stringify({ reportID });
  });
}
