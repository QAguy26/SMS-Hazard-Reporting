# SMS Hazard Reporting Dashboard

An Angular SPA dashboard that displays hazard and concern data from Smartsheet with automatic hourly updates.

## Features

- **Real-time Data**: Fetches data from Smartsheet API every hour
- **Filtering**: Filter by Risk Score, Responsible Department, and Days Open
- **Color-Coded Risk Scores**: Visual indicators for risk levels
- **Responsive Design**: Clean, professional dashboard interface
- **Auto-Refresh**: Automatic data updates without manual refresh

## Prerequisites

- Node.js (v14 or higher)
- Angular CLI
- Smartsheet API Token

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/QAguy26/SMS-Hazard-Reporting.git
   cd SMS-Hazard-Reporting
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory (copy from `.env.example`):
   ```
   SMARTSHEET_API_TOKEN=your_new_token_here
   SMARTSHEET_SHEET_ID=vMCgm37QGv8293MqMggmRhHxRjgQmw9WFWjCF9q1
   ```

4. Start the development server:
   ```bash
   ng serve
   ```

5. Open your browser and navigate to `http://localhost:4200`

## Environment Variables

- `SMARTSHEET_API_TOKEN`: Your Smartsheet API authentication token
- `SMARTSHEET_SHEET_ID`: The Smartsheet ID for the hazard data

## Architecture

- **SmartsheetService**: Handles API communication and auto-refresh logic
- **DashboardComponent**: Main UI component with filtering capabilities
- **HazardRecord Model**: TypeScript interface for data structure

## Auto-Refresh

The dashboard automatically fetches new data every 1 hour (3,600,000 milliseconds). The last update time is displayed at the top of the dashboard.

## Filtering Options

- **Risk Score**: Filter by specific risk score values
- **Responsible Department**: Filter by department name
- **Days Open**: Filter by number of days the issue has been open

## Security

⚠️ **Important**: Never commit your `.env` file to the repository. Always keep your Smartsheet API token secure.

## License

MIT