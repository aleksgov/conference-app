# Conference App

Репозиторий содержит full-stack приложение для управления научными конференциями:
- **Backend**: Java Spring Boot (Maven)
- **Frontend**: Next.js (React) в папке `frontend`
- **На выбор**: Electron-оболочка для desktop-версии

---

## Содержание

1. [Требования](#требования)
2. [Установка](#установка)
3. [Настройка базы данных](#настройка-базы-данных)
4. [Настройка окружения](#настройка-окружения)
5. [Запуск Backend (Spring Boot)](#запуск-backend-spring-boot)
6. [Запуск Frontend (Next.js)](#запуск-frontend-nextjs)
7. [Запуск в режиме Electron (desktop)](#запуск-в-режиме-electron-desktop)
8. [Сборка и продакшен-режим](#сборка-и-продакшен-режим)
9. [Полезные команды](#полезные-команды)

---

## Требования

Перед началом убедитесь, что на вашей машине установлено:

- **Java 17+** (или совместимая с вашим Spring Boot)
- **Maven 3.6+**
- **Node.js 18+** и **npm 9+**
- **PostgreSQL 12+** (или другая реляционная СУБД, но инструкции ниже — для PostgreSQL)

При необходимости также:
- **Git** (для клонирования репозитория)
- **Yarn** (в проекте используется **Npm**)

---

## Установка

1. Клонируйте репозиторий:

   ```bash
   git clone https://github.com/ваш-пользователь/conference-app.git
   cd conference-app


2. Установите зависимости для фронтенда и бэкенда:

   ```bash
   # Перейдите в папку frontend и установите зависимости
   cd frontend
   npm install

   # Вернитесь в корень и установите зависимости для Spring Boot
   cd ..
   mvn clean install
   ```

    * В папке `frontend` скачиваются зависимости для Next.js, React и Electron.
    * В корне (`pom.xml`) скачиваются зависимости Spring Boot.

---

## Настройка базы данных

Для инициализации запустите скрипт

    node create_db.mjs

---

## Настройка окружения

### Backend (Spring Boot)

В корне проекта (`conference-app`) создайте файл `src/main/resources/application.properties` (или `application.yml`) и заполните параметры подключения к базе и JWT:

```properties
# application.properties

# Настройки подключения к PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/conference_db
spring.datasource.username=conference_user
spring.datasource.password=secure_password
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update

# Порт, на котором будет работать backend
server.port=8080

# JWT-ключ (пример)
jwt.secret=ВашСекретныйКлючДляJWT
jwt.expiration-ms=86400000
```

> **Важно:**
>
> * Убедитесь, что `spring.datasource.url`, `username` и `password` соответствуют реальным данным.
> * Параметр `spring.jpa.hibernate.ddl-auto=update` автоматически создаёт или обновляет таблицы при старте приложения. Для продакшена рекомендуется перенести DDL в миграции (Flyway/Liquibase) и сменить на `validate` или `none`.
> * Параметр `jwt.secret` используется для подписи токенов. Выберите длинную случайную строку.

### Frontend (Next.js)

В папке `frontend` создайте файл `.env.local` (он будет автоматически загружен Next.js) и укажите базовый URL вашего backend:

```dotenv
# frontend/.env.local

NEXT_PUBLIC_API_URL=http://localhost:8080/api
# Если backend и frontend будут на одном домене/порту — скорректируйте URL.
```

> **Пример переменных:**
>
> ```dotenv
> NEXT_PUBLIC_API_URL=http://localhost:8080/api
> NEXT_PUBLIC_JWT_STORAGE_KEY=auth_token
> ```

* `NEXT_PUBLIC_API_URL` используется для всех запросов из Next.js к Spring Boot.
* Дополнительно можно задать имя ключа в localStorage для хранения JWT (`NEXT_PUBLIC_JWT_STORAGE_KEY`), если в проекте это предусмотрено.

---

## Запуск Backend (Spring Boot)

Перейдите в корневую директорию проекта (`conference-app`) и выполните:

```bash
mvn spring-boot:run
```

* Приложение поднимется на порту `8080` (если не изменено в `application.properties`).
* В логе вы увидите, что Hibernate создал таблицы, а Spring Boot успешно стартовал.

---

## Запуск Frontend (Next.js)

Перейдите в папку `frontend` и выполните:

```bash
npm run dev
```

* По умолчанию Next.js стартует на `http://localhost:3000`.
* Если всё настроено верно, интерфейс будет делать запросы к `http://localhost:8080/api/...`.

Скрипты из `package.json` (папка `frontend`):

* `npm run dev` — запускает Next.js в режиме разработки.
* `npm run build` — собирает продакшен-версию (в папке `.next`).
* `npm run start` — запускает собранный Next.js на порту 3000.
* `npm run electron` — параллельно запускает Next.js (`next dev`) и Electron, который после поднятия фронтенда открывает окно desktop-приложения.

---

## Запуск в режиме Electron (desktop)

Для запуска desktop-версии (Electron) выполните:

1. Убедитесь, что вы выполнили `npm install` в папке `frontend`.
2. Запустите команду:

   ```bash
   npm run electron
   ```

* Сначала поднимется Next.js, а когда интерфейс по адресу `http://localhost:3000` станет доступен — автоматически запустится Electron-окно.
* Для деплоя Electron-приложения используйте `electron-builder` (см. [Документацию Electron Builder](https://www.electron.build/)).

---

Удачной работы!