# Vission - SHardeum Historical Data Dashboard

![Shardeum Logo](https://shardeum.nyc3.cdn.digitaloceanspaces.com/shardeum/2023/03/New-logo.png)

Vission is a modern, responsive web application that provides real-time analytics and visualizations for the Shardeum blockchain. It offers a comprehensive view of blockchain metrics, transaction data, and network health in an intuitive dashboard interface.

## Features

- **Real-time Blockchain Metrics**: Track transactions, value transferred, gas usage, and more
- **Time-based Filtering**: View data across different time ranges (1d, 7d, 1m, all time)
- **Transaction Analysis**: Visualize transaction type distribution with interactive charts
- **Account Tracking**: Monitor top SHM holders and unique address trends
- **Block Statistics**: View block production metrics, average transactions per block, and block time
- **Network Health Monitoring**: Track the Shardeum network status and uptime

## Screenshots

![Dashboard Screenshot](https://example.com/screenshot.png)

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with React-Chartjs-2
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Project Structure

```
shardvission/
├── public/              # Static assets
├── src/                 # Source code
│   ├── components/      # React components
│   ├── services/        # API services
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── README.md            # Project documentation
```

## Key Components

- **Dashboard**: Main container for all blockchain data visualizations
- **StatsGrid**: Displays key blockchain metrics in a responsive grid
- **TimeSelector**: Allows users to filter data by different time ranges
- **TransactionChart**: Visualizes transaction type distribution
- **TopAccountsTable**: Shows the top SHM holders
- **UniqueAddressesTrendChart**: Tracks unique address growth over time
- **Sidebar**: Navigation and network status display

## API Integration

The application connects to the Shardeum Transaction Indexer API, which provides endpoints for:

- Transaction counts and values
- Gas usage statistics
- Block metrics
- Account information
- Network health status

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone 
   cd shardvission
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## Configuration

The application uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```
VITE_API_URL=http://your-api-url
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Shardeum](https://shardeum.org/) for the blockchain platform
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Chart.js](https://www.chartjs.org/) for the charting library
- [Lucide React](https://lucide.dev/) for the icon set
