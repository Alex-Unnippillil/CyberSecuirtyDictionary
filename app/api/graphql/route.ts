import { ApolloServer, gql } from 'apollo-server-micro';
import data from '../../../terms.json';

interface Term {
  term: string;
  definition: string;
}

const terms: Term[] = (data as any).terms || [];

const typeDefs = gql`
  type Term {
    term: String!
    definition: String!
  }

  type Query {
    terms: [Term!]!
    term(name: String!): Term
  }
`;

const resolvers = {
  Query: {
    terms: () => terms,
    term: (_: unknown, { name }: { name: string }) =>
      terms.find((t) => t.term.toLowerCase() === name.toLowerCase()),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
const startServer = server.start();

export async function POST(req: Request) {
  await startServer;
  const { query, variables, operationName } = await req.json();
  const result = await server.executeOperation({
    query,
    variables,
    operationName,
  });
  return Response.json(result);
}

export async function GET() {
  const playground = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>GraphQL Playground</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/graphql-playground-react@1.7.33/build/static/css/index.css" />
    <link rel="shortcut icon" href="https://cdn.jsdelivr.net/npm/graphql-playground-react@1.7.33/build/favicon.png"/>
    <script src="https://cdn.jsdelivr.net/npm/graphql-playground-react@1.7.33/build/static/js/middleware.js"></script>
  </head>
  <body>
    <div id="root"/>
    <script>
      window.addEventListener('load', function () {
        GraphQLPlayground.init(document.getElementById('root'), { endpoint: '/api/graphql' })
      })
    </script>
  </body>
</html>`;
  return new Response(playground, { headers: { 'content-type': 'text/html' } });
}

