const { DB_URL } = process.env;
const ENV = process.env.NODE_ENV || "development";

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations",
  },
  seeds: {
    directory: "./db/seeds",
  },
};

const customConfig = {
  production: {
    connection: {
      connectionString: DB_URL,
      ssl: { rejectUnauthorized: false },
    },
  },
  development: {
    connection: {
      database: "nc_news",
    },
  },
  test: {
    connection: {
      database: "nc_news_test",
    },
  },
};

module.exports = { ...baseConfig, ...customConfig[ENV] };
