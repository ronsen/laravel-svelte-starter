FROM ubuntu:latest

WORKDIR /var/www

ARG DEBIAN_FRONTEND noninteractive

RUN apt update

RUN apt install -y software-properties-common \
	curl \
	zip \
	unzip

RUN apt install -y php-cli \
	php-fpm \
	php-sqlite3 \
	php-gd \
	php-curl \
	php-imap \
	php-mbstring \
	php-xml \
	php-zip \
	php-bcmath \
	php-soap \
	php-intl \
	php-readline \
	php-ldap \
	php-msgpack \
	php-igbinary \
	php-redis \
	php-memcached \
	php-pcov \
	php-imagick \
	php-xdebug

RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt update && apt install -y nodejs

RUN apt clean && rm -rf /var/lib/apt/lists/*

RUN curl -sLS https://getcomposer.org/installer | php -- --install-dir=/usr/bin/ --filename=composer

COPY . .
RUN cp .env.example .env

RUN composer install --optimize-autoloader

RUN php artisan key:generate
RUN php artisan migrate --seed --force

RUN npm install
RUN npm run build

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
