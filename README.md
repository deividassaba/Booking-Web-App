# Booking-Web-App

Technical assignment for an internship developer position on the IDT team.

**Tech stack:** .NET, React, TypeScript, Material UI, xUnit, FullCalendar, QuestPDF.

## Features

- Room and user management
- Create, cancel, and complete reservations
- Reservation calendar
- Filter reservations by room, organizer, status, and date range
- Generate and download PDF reservation reports

## Getting Started

### Backend

```bash
dotnet restore
dotnet run
```

### Frontend

```bash
npm install
npm run dev
```

### Tests

```bash
dotnet test
```

## Notes

- The backend uses an in-memory database; data is lost when the application restarts.
- Configure the frontend .env API URL before running the application.
