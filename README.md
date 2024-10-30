# node_cron_db_backup

A Node.js script for daily MySQL database backups, retaining the last 7 days of backups, and deleting older backups. Logs all activities.

## Features

- **Daily Backups**: The script runs daily at midnight to create a backup of the specified MySQL database.
- **Backup Retention**: Keeps backups for the last 7 days and automatically deletes older backups.
- **Logging**: Logs all activities, including backup creation and deletion of old backups, to a log file.
- **Configuration**: Uses environment variables for configuration, making it easy to customize.

## Configuration

The script uses a `.env` file for configuration. Below is an example of the required environment variables:

```properties
DB_HOST=dbhost
DB_USERNAME=username
DB_PASSWORD=password
DB_PORT=dbport
DB_NAME=dbname
BACKUP_DIRECTORY=./backups
ROLLING_DAYS=7
```


# node_cron_db_backup

A Node.js script for daily MySQL database backups, retaining the last 7 days of backups, and deleting older backups. Logs all activities.

## Features

- **Daily Backups**: The script runs daily at midnight to create a backup of the specified MySQL database.
- **Backup Retention**: Keeps backups for the last 7 days and automatically deletes older backups.
- **Logging**: Logs all activities, including backup creation and deletion of old backups, to a log file.
- **Configuration**: Uses environment variables for configuration, making it easy to customize.

## Configuration

The script uses a `.env` file for configuration. Below is an example of the required environment variables:

```properties
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=asd123!
DB_PORT=3306
DB_NAME=ohm
BACKUP_DIRECTORY=./backups
ROLLING_DAYS=7
```

- `DB_HOST`: The hostname of the MySQL server.
- `DB_USERNAME`: The username to connect to the MySQL server.
- `DB_PASSWORD`: The password to connect to the MySQL server.
- `DB_PORT`: The port number of the MySQL server.
- `DB_NAME`: The name of the database to back up.
- `BACKUP_DIRECTORY`: The directory where backups will be stored.
- `ROLLING_DAYS`: The number of days to retain backups.

## Usage

1. Clone the repository:
   ```sh
   git clone https://github.com/BhonePyae159/node_cron_db_backup.git
   cd node_cron_db_backup
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add your configuration.

4. Run the script:
   ```sh
   npm start
   ```

## Dependencies

- `node-cron`: For scheduling the daily backup task.
- `mysql2/promise`: For connecting to the MySQL database.
- `fs-extra`: For file system operations.
- `adm-zip`: For creating ZIP archives.
- `child_process`: For executing shell commands.
- `date-fns`: For date formatting.
- `dotenv`: For loading environment variables from a `.env` file.

## License

This project is licensed under the ISC License.
```
This [README.md](http://_vscodecontentref_/1) file provides a clear and concise documentation of your project, including its features, configuration, usage, dependencies, and license.