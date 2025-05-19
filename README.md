# MagicPlayerAPI with Telegram Bot Integration

This project is a Node.js backend application written in TypeScript that integrates with Telegram bot functionality. It provides authentication via Telegram and serves as a secure backend API with SQLite database support.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Usage](#usage)
- [Database](#database)
- [Telegram Bot Integration](#telegram-bot-integration)

## Requirements

- Node.js (v20 or higher)
- npm or yarn
- SQLite

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dimonss/MagicPlayerAPI-TgBot.git
   cd MagicPlayerAPI-TgBot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
PORT=4001
TG_TOKEN=your-telegram-bot-token
AUTH=your-secret-basic-auth
HOSTNAME=localhost
```

## Project Structure

```
/src
  /constants      # Application constants and enums
  /db            # Database models and configurations
  /DTO           # Data Transfer Objects
  /middleware    # Express middlewares
  /tgBot         # Telegram bot implementation
  /types         # TypeScript type definitions
  /utils         # Utility functions
  constants.ts   # Global constants
  index.ts       # Application entry point
/static          # Static files
migrations.js    # Database migrations
```

## Scripts

Available npm scripts:

```json
{
  "start:dev": "Run the application in development mode with hot reloading",
  "start:prod": "Build and run the application in production mode",
  "build": "Build the TypeScript project",
  "lint": "Run ESLint on TypeScript files",
  "format": "Format TypeScript files using ESLint"
}
```

## Usage

1. Set up your environment variables in `.env`
2. Run the development server:
   ```bash
   npm run start:dev
   ```
   or for production:
   ```bash
   npm run start:prod
   ```

## Database

The project uses SQLite as its database. The database file is `db.sqlite` in the root directory. Migrations can be run using the `migrations.js` file.

## Dependencies

Main dependencies include:
- Express.js for the web server
- node-telegram-bot-api for Telegram integration
- Sequelize as ORM
- SQLite for database
- TypeScript for development

Development tools:
- ESLint for code linting
- Prettier for code formatting
- ts-node-dev for development server
- TypeScript and related tools

## Telegram Bot Integration

1. Create a new bot through BotFather on Telegram
2. Get your bot token and add it to `.env`
3. The bot implementation can be found in the `/src/tgBot` directory

## Development

- The project uses TypeScript for better type safety
- ESLint and Prettier are configured for code quality
- Husky is set up for pre-commit hooks
- ts-node-dev is configured for development with hot reloading

## License

This project is licensed under the MIT License.
