# TikTok Effect Video Count Tracker

This project is a Node.js script that scrapes the number of videos using a specific TikTok effect and stores the count in a local SQLite database. It is designed for periodic tracking and analysis of TikTok effect popularity over time.

## Features
- **Automated Scraping:** Uses Puppeteer to fetch the video count for a TikTok effect.
- **SQLite Storage:** Saves each count with a timestamp for historical tracking.
- **Configurable Effect URL:** The TikTok effect URL is managed via a `.env` file for easy updates.
- **Headless Operation:** Runs in headless mode for automation and server environments.

## Requirements
- Node.js (v14 or higher recommended)
- npm

## Setup

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd scrape_tiktok_effect_videos_count
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure the TikTok Effect URL:**
   - Edit the `.env` file to set the TikTok effect page you want to track:
     ```env
     TIKTOK_EFFECT_URL=https://www.tiktok.com/effect/Name-Football-Player-Mic-1104563079
     ```

## Usage

Run the tracker script:
```sh
node tracker.js
```

- The script will scrape the video count for the effect URL specified in `.env` and store it in `tiktok_counts.db`.
- Each run adds a new row with the current timestamp and count.

## Database
- The SQLite database file is `tiktok_counts.db`.
- Table: `video_counts`
  - `id` (INTEGER, primary key)
  - `timestamp` (DATETIME, auto-generated)
  - `count` (INTEGER, the scraped video count)

## Customization
- To track a different TikTok effect, change the `TIKTOK_EFFECT_URL` in `.env`.
- You can schedule the script to run periodically (e.g., with Windows Task Scheduler or a cron job on Linux).

## Troubleshooting
- **Puppeteer errors:** Ensure all dependencies are installed and you have a stable internet connection.
- **Selector not found:** TikTok may change their page structure. Update the selector in `tracker.js` if needed.
- **Database issues:** Make sure you have write permissions in the project directory.

## Contributing
Pull requests and issues are welcome! Please open an issue to discuss major changes.

## License
MIT

## Disclaimer
This project is for educational and research purposes only. Use responsibly and respect TikTok's terms of service.
