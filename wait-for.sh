#!/bin/sh
echo "Waiting for CAS and Mailer services..."

while ! nc -z cas 4000 || ! nc -z mailer 4001; do
  sleep 2
done

echo "CAS and Mailer are up! Starting Gateway..."
npm run start
