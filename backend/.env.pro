# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

NODE_ENV="development" # for pro "production", cookie secure relted
DATABASE_URL="mongodb+srv://rthuid:HXeIC6nuXjxBimFH@clustermailer.fqa44um.mongodb.net/?retryWrites=true&w=majority&appName=ClusterMailer"
PORT=4001
ENCRYPTION_SECRET=your-very-secure-secret-key
# G_APP_PASS="rzqn imtn jnvh tiss"
RABBITMQ_URL="amqp://localhost:5672"
# for gateway header
JWT_SECRET=your-very-secure-secret-key
JWT_ACCESS_SECRET="SuperSecretKey123!@#SecureAndLongEnoughToBeHardToGuess"
