#!/bin/bash
set -e

echo "⏳ Esperando a que MySQL esté disponible en db:3306..."
until nc -z $DB_HOST $DB_PORT; do
  echo "🔁 Aún no está listo, esperando..."
  sleep 2
done

echo "✅ MySQL está disponible. Continuando..."

# Instalar dependencias con Composer solo si no existe el directorio vendor
if [ ! -d "vendor" ]; then
  echo "Instalando dependencias con Composer..."
  composer install --optimize-autoloader --no-dev
fi

# Generar la clave de la aplicación si no está configurada en .env
if ! grep -q "APP_KEY=base64" .env; then
  echo "Generando clave de la aplicación..."
  php artisan key:generate
fi

php artisan queue:work --tries=1 &

# Limpiar caches: configuración, rutas y vistas
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "⚙️ Ejecutando migraciones..."
php artisan migrate --force

# if [ "$RUN_SEED" = "true" ]; then
#   echo "🌱 Ejecutando seeders..."
#   php artisan db:seed --force
# fi



echo "🚀 Iniciando Apache..."
exec apache2-foreground
