# 🎂 Birthday Reminder App

A full-stack, production-ready application that automates birthday reminders and sends personalized emails to celebrate your customers' special days.

## 🎯 Features

- **UI Interface**: Simple and beautiful form to collect user information (username, email, date of birth)
- **Automated Cron Jobs**: Daily check at 7 AM for birthdays
- **Email Notifications**: Personalized HTML emails with beautiful designs using Nodemailer
- **Queue Management**: Bull Queue with Redis for reliable email delivery
- **Unique Emails**: Email uniqueness validation
- **Docker Support**: Containerized application with Docker Compose
- **Advanced Testing**: Comprehensive unit and integration tests with Jest
- **Webhooks & Callbacks**: Status monitoring endpoints
- **Production Ready**: Error handling, validation, logging

## 📋 Tech Stack

### Backend
- **Node.js & Express**: Server and API
- **MongoDB**: Database
- **Bull Queue**: Job queue for reliable email delivery
- **Cron**: Scheduled tasks
- **Nodemailer**: Email service

### Frontend
- **React**: User interface
- **Axios**: API client
- **CSS3**: Styling

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Jest**: Testing framework

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- Redis
- Docker & Docker Compose (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Fabrice553/Birthday-Reminder-App.git
cd Birthday-Reminder-App
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start services**
```bash
# Option 1: Using Docker Compose (recommended)
docker-compose up -d

# Option 2: Manual setup
# Start MongoDB
mongod

# Start Redis
redis-server

# Start application
npm start
```

### Usage

1. **Open the application**
Navigate to `http://localhost:3000`

2. **Add birthdays**
- Fill in the form with username, email, and date of birth
- Click "Add Birthday 🎂"

3. **Automatic reminders**
- The system checks for birthdays daily at 7 AM
- Personalized emails are sent automatically

4. **Test manually**
```bash
curl -X POST http://localhost:3000/api/birthdays/trigger/reminders
```

## 📧 Email Configuration

### Using Gmail
1. Enable 2FA on your Google account
2. Generate an App Password
3. Add to `.env`:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Using Other Services
Update `.env` with your email service credentials.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- tests/birthday.test.js
```

## 📊 API Endpoints

### Create Birthday
```bash
POST /api/birthdays
{
  "username": "John Doe",
  "email": "john@example.com",
  "dateOfBirth": "1990-01-15"
}
```

### Get All Birthdays
```bash
GET /api/birthdays
```

### Get Today's Birthdays
```bash
GET /api/birthdays/today
```

### Update Birthday
```bash
PUT /api/birthdays/:id
```

### Delete Birthday
```bash
DELETE /api/birthdays/:id
```

### Trigger Reminders (Manual)
```bash
POST /api/birthdays/trigger/reminders
```

### Queue Status
```bash
GET /api/webhooks/queue/status
```

### Cron Status
```bash
GET /api/webhooks/cron/status
```

## 🐳 Docker Deployment

### Build and Run
```bash
# Build image
npm run docker:build

# Run container
npm run docker:run

# Or use Docker Compose
npm run docker:compose
```

## 📁 Project Structure

```
birthday-reminder-app/
├── server/
│   ├── index.js
│   ├── config.js
│   ├── models/
│   │   └── birthdayModel.js
│   ├── controllers/
│   │   └── birthdayController.js
│   ├── services/
│   │   ├── emailService.js
│   │   ├── queueService.js
│   │   └── cronService.js
│   └── routes/
│       ├── birthdayRoutes.js
│       └── webhookRoutes.js
├── client/
│   ├── src/
│   │   ├── App.js
│   │   ├── components/
│   │   ├── api/
│   │   └── App.css
│   └── public/
├── tests/
│   └── birthday.test.js
├── Dockerfile
├── docker-compose.yml
├── package.json
└── .env
```

## 🔄 How It Works

1. **Data Collection**: Users add their birthday information via the web interface
2. **Storage**: Data is validated and stored in MongoDB with unique email constraints
3. **Scheduling**: Cron job runs at 7 AM daily
4. **Checking**: System checks if today matches any stored birthdays
5. **Queuing**: Matching birthdays are added to Bull queue
6. **Sending**: Queue processor sends personalized emails via Nodemailer
7. **Logging**: All operations are logged for monitoring

## 🎨 Email Design

The application sends beautifully designed HTML emails with:
- Gradient backgrounds
- Personalized greeting
- Cake and balloon emojis
- Birthday wishes
- Professional layout

## 📝 Error Handling

- Input validation with Joi schemas
- Database error handling
- Email service error handling
- Queue retry mechanism (3 attempts with exponential backoff)
- Comprehensive error logging

## 🔒 Security Features

- Email uniqueness validation
- Input sanitization
- CORS protection
- Helmet security headers
- Environment variable protection

## 🌟 Features Demonstration

### Cron Job
- Automatic daily execution at 7 AM
- Reset flag mechanism
- Error handling and logging

### Bull Queue
- Reliable message delivery
- Retry mechanism
- Job tracking
- Queue monitoring

### Advanced Testing
- Unit tests for controllers
- Integration tests for API
- Mock database testing
- Error scenario testing

### Callbacks & Webhooks
- Queue status endpoint
- Cron status endpoint
- Real-time monitoring

## 🚀 Future Enhancements

- SMS notifications
- Calendar integration
- Analytics dashboard
- Email templates customization
- Multi-language support
- Admin panel

## 📄 License

MIT License

## 👨‍💻 Author

Created as an assessment project demonstrating:
- Background workers and queues
- Cron jobs and scheduling
- Callbacks and webhooks
- Advanced testing practices
- Containerization and Docker

## 🎉 Enjoy!

This project demonstrates professional development practices and can be used as a template for similar applications.