/* eslint-disable no-undef */
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const { Pool } = pg;

const mainPool = new Pool({
    database: 'postgres',
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
});

async function createDatabase() {
    const client = await mainPool.connect();
    try {
        // Проверка существования БД
        const dbCheck = await client.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [process.env.DB_NAME]
        );

        if (dbCheck.rowCount === 0) {
            await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
            console.log(`База данных ${process.env.DB_NAME} создана`);
        } else {
            console.log(`База данных ${process.env.DB_NAME} уже существует`);
        }
    } catch (error) {
        console.error('Ошибка при создании БД:', error);
        throw error;
    } finally {
        client.release();
    }
}

async function createTables() {
    const dbPool = new Pool({
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
    });

    const client = await dbPool.connect();
    try {

        const typeCheck = await client.query(
            `SELECT 1 FROM pg_type WHERE typname = $1`,
            ['role_enum']
        );
        if (typeCheck.rowCount === 0) {
            await client.query(`
                CREATE TYPE role_enum AS ENUM ('ADMIN', 'USER');
            `);
            console.log('Тип role_enum создан');
        } else {
            console.log('Тип role_enum уже существует, создание пропущено');
        }

        await client.query(`
            CREATE TABLE IF NOT EXISTS Conference (
                conference_id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                start_date DATE NOT NULL,
                end_date DATE NOT NULL
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS Section (
                section_id SERIAL PRIMARY KEY,
                conference_id INT REFERENCES Conference(conference_id),
                name TEXT NOT NULL,
                start_time TIME NOT NULL,
                end_time TIME NOT NULL
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS Auditorium (
                auditorium_id SERIAL PRIMARY KEY,
                section_id INT REFERENCES Section(section_id),
                capacity INT NOT NULL
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS Participant (
                participant_id SERIAL PRIMARY KEY,
                full_name TEXT NOT NULL,
                organization TEXT NOT NULL
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role role_enum NOT NULL,
                participant_id INT REFERENCES Participant(participant_id)
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS Article (
                article_id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                pages INT NOT NULL,
                authors TEXT NOT NULL,
                section_id INT REFERENCES Section(section_id)
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS Presentation (
                presentation_id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                authors TEXT NOT NULL,
                article_id INT REFERENCES Article(article_id)
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS Participant_Article (
                participant_id INT REFERENCES Participant(participant_id) ON DELETE CASCADE,
                article_id INT REFERENCES Article(article_id) ON DELETE CASCADE,
                PRIMARY KEY (participant_id, article_id)
            );
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        `);

        console.log('Все таблицы успешно созданы/проверены');
    } catch (error) {
        console.error('Ошибка при создании таблиц:', error);
        throw error;
    } finally {
        client.release();
        await dbPool.end();
    }
}

async function main() {
    try {
        await createDatabase();
        await createTables();
    } catch (error) {
        console.error('Фатальная ошибка:', error);
        process.exit(1);
    } finally {
        await mainPool.end();
    }
}

main().then(() => {
    console.log('Скрипт завершил работу');
    process.exit();
});