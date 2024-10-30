import cron from 'node-cron';
import mysql from 'mysql2/promise';
import fs from 'fs-extra';
import path from 'path';
import AdmZip from 'adm-zip';
import { execSync } from 'child_process';
import { format } from 'date-fns';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Configuration from .env
const config = {
    db_host: process.env.DB_HOST || 'localhost',
    db_username: process.env.DB_USERNAME || 'root',
    db_password: process.env.DB_PASSWORD || '',
    db_port: parseInt(process.env.DB_PORT, 10) || 3306,
    db_name: process.env.DB_NAME,
    backup_directory: path.resolve(process.env.BACKUP_DIRECTORY || path.join(__dirname, 'backups')),
    rolling_days: parseInt(process.env.ROLLING_DAYS, 10) || 7,
};

if (!config.db_name) {
    console.error('Error: DB_NAME is not set in .env file.');
    process.exit(1);
}

// Create MySQL connection pool
const pool = mysql.createPool({
    host: config.db_host,
    user: config.db_username,
    password: config.db_password,
    port: config.db_port,
    database: config.db_name,
});

// Helper: Write logs to a file
function writeLog(logMessage) {
    const logDirectory = path.join(config.backup_directory, 'logs');
    const logFilePath = path.join(logDirectory, `${format(new Date(), 'yyyy-MM-dd')}.log`);

    fs.ensureDirSync(logDirectory);

    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const logEntry = `[${timestamp}] ${logMessage}\n`;
    fs.appendFileSync(logFilePath, logEntry, 'utf8');
}

// Backup logic
async function backupDatabase() {
    try {
        await fs.ensureDir(config.backup_directory);

        const today = format(new Date(), 'yyyy-MM-dd');
        const zipName = `${config.db_name}_${today}.zip`;
        const zipPath = path.join(config.backup_directory, zipName);

        writeLog(`Creating backup for ${today}...`);

        const [tables] = await pool.query('SHOW TABLES');
        const tableList = tables.map(row => Object.values(row)[0]);

        const tmpBackupDir = path.join(config.backup_directory, `tmp_${today}`);
        await fs.ensureDir(tmpBackupDir);

        for (const table of tableList) {
            const sqlFilePath = path.join(tmpBackupDir, `${table}.sql`);
            const dumpCommand = `mysqldump -h ${config.db_host} -u ${config.db_username} ` +
                `-p${config.db_password} ${config.db_name} ${table} > ${sqlFilePath}`;
            execSync(dumpCommand);
            writeLog(`Exported ${table}.sql`);
        }

        const zip = new AdmZip();
        zip.addLocalFolder(tmpBackupDir);
        zip.writeZip(zipPath);
        writeLog(`Backup created at ${zipPath}`);

        await fs.remove(tmpBackupDir);

        await deleteOldBackups();
    } catch (error) {
        writeLog(`Backup failed: ${error.message}`);
        console.error('Backup failed:', error);
    }
}

// Helper: Delete backups older than rolling_days
async function deleteOldBackups() {
    try {
        const now = new Date();
        const files = await fs.readdir(config.backup_directory);
        const backupFiles = files.filter(file => file.endsWith('.zip'));

        for (const file of backupFiles) {
            const filePath = path.join(config.backup_directory, file);
            const stats = await fs.stat(filePath);
            const fileAge = (now - stats.mtime) / (1000 * 60 * 60 * 24); // Age in days

            if (fileAge > config.rolling_days) {
                await fs.remove(filePath);
                writeLog(`Deleted old backup: ${file}`);
            }
        }
    } catch (error) {
        writeLog(`Failed to delete old backups: ${error.message}`);
        console.error('Failed to delete old backups:', error);
    }
}

// Schedule the backup to run daily at midnight (00:00)
cron.schedule('0 0 * * *', () => {
    writeLog('Starting daily backup...');
    backupDatabase();
});

