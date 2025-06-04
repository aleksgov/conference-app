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

        const roleTypeCheck = await client.query(
            `SELECT 1 FROM pg_type WHERE typname = $1`,
            ['role_enum']
        );
        if (roleTypeCheck.rowCount === 0) {
            await client.query(`
                CREATE TYPE role_enum AS ENUM ('ADMIN', 'USER');
            `);
            console.log('Тип role_enum создан');
        } else {
            console.log('Тип role_enum уже существует');
        }

        const genderTypeCheck = await client.query(
            `SELECT 1 FROM pg_type WHERE typname = $1`,
            ['gender_enum']
        );
        if (genderTypeCheck.rowCount === 0) {
            await client.query(`
                CREATE TYPE gender_enum AS ENUM (
                    'MALE',
                    'FEMALE',
                    'OTHER',
                    'UNSPECIFIED'
                );
            `);
            console.log('Тип gender_enum создан');
        } else {
            console.log('Тип gender_enum уже существует');
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
                organization TEXT NOT NULL
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role role_enum NOT NULL,
                full_name TEXT NOT NULL,
                date_of_birth DATE NOT NULL,
                gender gender_enum NOT NULL DEFAULT 'UNSPECIFIED',
                phone VARCHAR(20) NULL,
                participant_id INT REFERENCES Participant(participant_id)
            );
        `);

        await client.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS idx_users_participant_id_unique
            ON users(participant_id);
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS Article (
                article_id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                pages INT NOT NULL,
                section_id INT REFERENCES Section(section_id)
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS Participant_Article (
                participant_id INT REFERENCES Participant(participant_id) ON DELETE CASCADE,
                article_id INT REFERENCES Article(article_id) ON DELETE CASCADE,
                PRIMARY KEY (participant_id, article_id)
            );
        `);

        const statusTypeCheck = await client.query(
            `SELECT 1 FROM pg_type WHERE typname = $1`,
            ['application_status_enum']
        );
        if (statusTypeCheck.rowCount === 0) {
            await client.query(`
                CREATE TYPE application_status_enum AS ENUM (
                    'PENDING',
                    'APPROVED',
                    'REJECTED'
                );
            `);
            console.log('Тип application_status_enum создан');
        } else {
            console.log('Тип application_status_enum уже существует');
        }

        await client.query(`
            CREATE TABLE IF NOT EXISTS Conference_Application (
                application_id SERIAL PRIMARY KEY,
                user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
                conference_id INT REFERENCES Conference(conference_id) ON DELETE CASCADE,
                section_id INT REFERENCES Section(section_id) ON DELETE SET NULL,
                article_title TEXT NOT NULL,
                status application_status_enum NOT NULL DEFAULT 'PENDING',
                submitted_at TIMESTAMP NOT NULL DEFAULT NOW(),
                reviewed_at TIMESTAMP NULL,
                admin_comment TEXT NULL
            );
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_applications_status
            ON Conference_Application(status);
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        `);


        await client.query(`
            INSERT INTO Conference (name, start_date, end_date) VALUES
                ('Научная конференция БТН 2025', '2025-03-15', '2025-03-15'),
                ('Технологии будущего', '2025-05-10', '2025-05-11'),
                ('Цифровые решения', '2025-06-01', '2025-06-02'),
                ('Искусственный интеллект', '2025-07-12', '2025-07-12'),
                ('Инновации и стартапы', '2025-08-22', '2025-08-25'),
                ('Наука и техника', '2025-09-10', '2025-09-13'),
                ('Робототехника', '2025-10-05', '2025-10-07'),
                ('Квантовые технологии', '2025-11-18', '2025-11-20')
            ON CONFLICT DO NOTHING; 
        `);

        await client.query(`
            INSERT INTO Section (conference_id, name, start_time, end_time) VALUES
                (1, 'Математика', '09:00', '12:00'),
                (1, 'Физика', '13:00', '16:00'),
                (2, 'Программирование', '09:00', '12:00'),
                (2, 'Информационная безопасность','13:00', '16:00'),
                (3, 'Робототехника', '09:00', '12:00'),
                (4, 'Искусственный интеллект', '09:00', '12:00'),
                (5, 'Инновации в стартапах', '13:00', '16:00'),
                (6, 'Инженерия', '09:00', '12:00')
            ON CONFLICT DO NOTHING;
        `);


        await client.query(`
            INSERT INTO Auditorium (section_id, capacity) VALUES
                (1, 50),
                (1, 100),
                (2, 75),
                (3, 150),
                (3, 200),
                (4, 120),
                (7, 80),
                (8, 60)
            ON CONFLICT DO NOTHING;
        `);

        await client.query(`
            INSERT INTO Participant (organization) VALUES
                ('МГУ'),
                ('СПбГУ'),
                ('НИУ ВШЭ'),
                ('ТГУ'),
                ('МФТИ'),
                ('МИСиС'),
                ('ЮФУ'),
                ('КФУ')
            ON CONFLICT DO NOTHING;
        `);

        await client.query(`
            INSERT INTO Article (name, pages, section_id) VALUES
                ('Алгебра и топология', 10, 1),
                ('Квантовая физика', 12, 2),
                ('Кибербезопасность', 15, 4),
                ('Искусственные нейронные сети', 8, 6),
                ('Робототехника в производстве', 10, 5),
                ('Инновационные стартапы', 7, 7),
                ('Квантовые вычисления', 14, 8),
                ('Астрономия', 9, 8)
            ON CONFLICT DO NOTHING;
        `);

        await client.query(`
            INSERT INTO Participant_Article (participant_id, article_id) VALUES
                (1, 1),
                (2, 2),
                (3, 3),
                (4, 4),
                (5, 5),
                (6, 6),
                (7, 7),
                (8, 8)
            ON CONFLICT DO NOTHING;
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

main()
    .then(() => {
        console.log('Скрипт завершил работу');
        process.exit();
    })
    .catch(() => {
        process.exit(1);
    });
