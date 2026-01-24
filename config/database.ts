import path from 'path';

export default ({ env }) => {
  const client = env('DATABASE_CLIENT', 'postgres'); // Defaulted to postgres for your setup

  const connections = {
    postgres: {
      connection: {
        connectionString: env('DATABASE_URL'),
        // Setting host/port/user/pass as fallbacks if URL is not parsed
        host: env('DATABASE_HOST'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME'),
        user: env('DATABASE_USERNAME'),
        password: env('DATABASE_PASSWORD'),
        ssl: env.bool('DATABASE_SSL', true) && {
          // Changed rejectUnauthorized to false to prevent the connection from hanging
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false),
        },
        schema: env('DATABASE_SCHEMA', 'public'),
      },
      pool: {
        min: env.int('DATABASE_POOL_MIN', 2),
        max: env.int('DATABASE_POOL_MAX', 10),
        propagateCreateError: false // Helps prevent hanging on initial connection failures
      },
    },
    sqlite: {
      connection: {
        filename: path.join(__dirname, '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };

  return {
    connection: {
      client,
      ...connections[client],
      // Increased timeout to account for Neon "cold starts"
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};