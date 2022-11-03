import { EntryDataFromServer } from 'common/types';
import { FastifyInstance, FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import { Collection, Document, WithId } from 'mongodb';

const opts: RouteShorthandOptions = {
  // schema: {
  //   response: {
  //     200: {
  //       type: 'object',
  //       properties: {
  //         pong: {
  //           type: 'string'
  //         }
  //       }
  //     }
  //   }
  // }
};

/**
 * Goes through every entry in the database and updates its hot score.
 */
async function updateHotScores(server: FastifyInstance, collection: Collection<Document>) {
  const startTime = Date.now();
  const entries = await collection.find({}).toArray();
  for (let i = 0; i < entries.length; i++) {
    // update its hot score
    // using same algorithm as Reddit: https://medium.com/hacking-and-gonzo/how-reddit-ranking-algorithms-work-ef111e33d0d9
    const ts = (startTime - entries[i].timestamp) / 1000; // seconds elapsed
    const x = entries[i].voteCount;
    const y = x > 0
        ? 1
        : x < 0 ? -1 : 0;
    const z = x >= 1 ? Math.abs(x) : 1;
    const hotScore = Math.log10(z) + (y * ts / 45000);
    await collection.updateOne({ _id: entries[i]._id }, {
      $set: {
        hotScore,
      },
    });
  }

  const endTime = Date.now();
  server.log.warn(`updated all entries' hotScores, it took: ${endTime - startTime} milliseconds`);
}

export async function routeListEntries(server: FastifyInstance) {
  const collection = server.mongo.db.collection('entries');

  await updateHotScores(server, collection);
  setInterval(() => updateHotScores(server, collection), 1000 * 60 * 10); // every 10 minutes, update hotScores

  // make sure to create indexes for faster sorting when fetching
  collection.createIndex({ voteCount: -1 });
  collection.createIndex({ timestamp: -1 });
  collection.createIndex({ hotScore: -1 });

  server.get('/list/:category', opts, async (req: FastifyRequest, res: FastifyReply) => {
    const { category } = req.params as { category: string };

    let results: WithId<Document>[];
    switch (category) {
      case 'hot':
        results = await collection.find({}).sort({ hotScore: -1 }).toArray();
        break;
      case 'top':
        results = await collection.find({}).sort({ voteCount: -1 }).toArray();
        break;
      case 'new':
        results = await collection.find({}).sort({ timestamp: -1 }).toArray();
        break;
    }

    // TODO: improve performance by not loading comments here (and denormalizing numComments to another field?)
    const entries: EntryDataFromServer[] = results.map(({
      id,
      title,
      author,
      description,
      timestamp,
      voteCount,
      
      // mutate these
      comments,
    }) => ({
      id,
      title,
      author,
      description,
      timestamp,
      voteCount,
      numComments: comments.length,
    }));

    // return list of entries without comments
    return JSON.stringify(entries);
  });
}
