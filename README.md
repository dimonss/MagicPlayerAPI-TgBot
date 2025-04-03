# MagicPlayerAPI with Telegram Bot Integration

This project is a Node.js backend application that integrates with Telegram bot functionality. It provides authentication via Telegram and serves as a secure backend API with SQLite database support.

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
   git clone https://github.com/yourusername/MagicPlayerAPI-TgBot.git
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
```

## Project Structure

```
/src
  /controllers
    - authController.js      # Handles authentication logic
  /middlewares
    - authMiddleware.js      # JWT authentication middleware
  /routes
    - authRoutes.js          # Defines API routes for Telegram login
  /services
    - telegramService.js     # Manages Telegram API interactions
  - app.js                   # Main Express app setup
.env                          # Environment configuration
package.json                  # Project configuration and dependencies
```

## Scripts

In the `package.json`, the following scripts are defined:

```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "test": "jest"
  }
}
```

- **`npm start`**: Starts the application in production mode.
- **`npm run dev`**: Starts the application in development mode with live reloading (using `nodemon`).
- **`npm test`**: Runs the test suite (if tests are set up).

## Usage

1. Clone the repository:

   ```bash
   git clone https://github.com/dimonss/MagicPlayerAPI-TgBot.git
   cd MagicPlayerAPI-TgBot
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the `.env` file with your environment variables.

4. Run the application:

   ```bash
   npm run dev
   ```

   The application will start on `http://localhost:3000`.

## Database

This project uses SQLite as its database.

## Telegram Bot Integration

1. **Create a Telegram Bot**:

  - Go to Telegram, find **BotFather** and create a new bot.
  - Save the bot token you receive.

2. **Set Webhook**:

   You'll need to set up a webhook to receive updates from Telegram when users interact with the bot. Run the following cURL command to set your webhook URL:

   ```bash
   curl -F "url=https://your-domain.com/auth/telegram/webhook" "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook"
   ```

   Replace `<YOUR_BOT_TOKEN>` with your bot token and `https://dich.tech/magic_player` with your server URL.

3. **Telegram Login Widget**:

  - Use the [Telegram login widget](https://core.telegram.org/widgets/login) to allow users to log in via Telegram on your frontend.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
