# Sentinel-X - Professional Network Traffic Analyzer

A modern, clean, and highly interactive web application for analyzing network traffic in real-time.

## Features

- **Real-time Packet Capture**: Monitor network traffic as it happens
- **Interactive Dashboard**: Beautiful charts and metrics with smooth animations
- **Modern UI**: Clean, professional design inspired by SaaS products like Stripe and Notion
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Export Functionality**: Export captured data as CSV or JSON
- **Responsive Design**: Works seamlessly on desktop and laptop screens
- **Live Updates**: Real-time WebSocket updates for instant data visualization

## Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Recharts (for interactive charts)
- Lucide React (icons)

### Backend
- Python FastAPI
- Scapy (packet capture)
- WebSockets (real-time communication)

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the project directory:
```bash
cd net-scope
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Start the backend server:
```bash
cd backend
python main.py
```

The backend will start on `http://localhost:8000`

### Frontend Setup

1. Install Node.js dependencies:
```bash
npm install
```

2. Start the React development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## Usage

1. **Start Capture**: Click the "Start" button in the navbar to begin packet capture
2. **Select Interface**: Choose the network interface you want to monitor from the dropdown
3. **View Metrics**: Monitor real-time statistics in the metric cards
4. **Analyze Charts**: View traffic patterns, protocol distribution, and top IP addresses
5. **Filter Packets**: Use the search and filter options in the packet feed
6. **Export Data**: Download captured data as CSV or JSON files

## Components

### Dashboard Layout
- **Navbar**: App controls, interface selector, capture controls, theme toggle
- **Metric Cards**: Real-time statistics (Total Packets, Active Connections, Data Transferred, Packets per Second)
- **Charts Section**: 
  - Network traffic over time (line chart)
  - Protocol distribution (pie chart)
  - Top IP addresses (bar chart)
- **Packet Feed**: Searchable, filterable table of captured packets with pagination

### Features
- Real-time WebSocket updates
- Smooth animations and transitions
- Responsive design for all screen sizes
- Professional color scheme with dark mode support
- Export functionality for data analysis

## API Endpoints

- `GET /api/stats` - Get current network statistics
- `GET /api/packets` - Get captured packets with pagination
- `POST /api/capture/start` - Start packet capture
- `POST /api/capture/stop` - Stop packet capture
- `GET /api/capture/status` - Get capture status
- `GET /api/interfaces` - Get available network interfaces
- `WebSocket /ws` - Real-time statistics updates

## Development Notes

- The application uses Scapy for packet capture, which may require administrator/root privileges on some systems
- WebSocket connection automatically reconnects if disconnected
- All data is stored in memory and not persisted to disk
- The UI is designed to be clean and professional, avoiding the typical "hacking tool" aesthetic

## Troubleshooting

### Packet Capture Issues
- On Windows, you may need to run the application as Administrator
- On macOS/Linux, you may need to use `sudo` for packet capture
- Make sure WinPcap/Npcap is installed on Windows

### WebSocket Connection Issues
- Ensure the backend is running on port 8000
- Check that no firewall is blocking the connection
- The frontend will automatically attempt to reconnect if the connection is lost

## License

This project is for educational and demonstration purposes.
