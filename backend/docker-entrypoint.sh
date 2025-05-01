#!/bin/bash
set -e

echo "⏳ Esperando a que MySQL esté disponible en db:3306..."
until nc -z $DB_HOST $DB_PORT; do
  echo "🔁 Aún no está listo, esperando..."
  sleep 2
done

echo "✅ MySQL está disponible. Continuando..."

if [ ! -d "vendor" ]; then
  echo "Instalando dependencias con Composer..."
  composer install --optimize-autoloader --no-dev
fi

if [ -z "$APP_KEY" ]; then
  echo "Generando clave de la aplicación..."
  php artisan key:generate
fi

# Procesar trabajos de cola en segundo plano
php artisan queue:work --tries=1 &

# Limpiar caches: configuración y rutas
php artisan config:clear
php artisan route:clear
# php artisan view:clear  ← 🔴 Esto lo quitamos

echo "⚙️ Ejecutando migraciones..."
php artisan migrate --force

echo "🚀 Iniciando Apache..."
php artisan queue:work --tries=1 &
exec apache2-foreground
