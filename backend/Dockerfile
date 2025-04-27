# Dockerfile para Laravel con Apache optimizado
FROM php:8.2-apache

# Instalar dependencias del sistema y extensiones PHP en un solo RUN, limpiando la cache de apt
RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip netcat-openbsd \
    && docker-php-ext-install pdo_mysql zip opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar Composer (copia desde la imagen oficial de Composer)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Habilitar mod_rewrite de Apache
RUN a2enmod rewrite

# Cambiar DocumentRoot a /public
RUN sed -ri -e 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf

# Copiar código del proyecto
COPY . /var/www/html

# Copiar configuración personalizada de PHP
COPY docker/php.ini /usr/local/etc/php/conf.d/php.ini

# Asignar permisos a directorios críticos
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Copiar y preparar el script de entrada
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
