
require('dotenv').config();
const puppeteer = require('puppeteer');
const sqlite3 = require('sqlite3').verbose();

// Initialize SQLite database
const db = new sqlite3.Database('tiktok_counts.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    return;
  }
  // Create table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS video_counts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      count INTEGER
    )
  `);
});

function parseVideoCount(text) {
  if (!text) return null;

  const cleanText = text.replace(/videos/i, '').trim();
  let multiplier = 1;
  let number = cleanText;

  if (cleanText.includes('B')) {
    multiplier = 1_000_000_000;
    number = cleanText.replace('B', '');
  } else if (cleanText.includes('M')) {
    multiplier = 1_000_000;
    number = cleanText.replace('M', '');
  } else if (cleanText.includes('K')) {
    multiplier = 1_000;
    number = cleanText.replace('K', '');
  }

  const parsedNumber = parseFloat(number) * multiplier;
  return isNaN(parsedNumber) ? null : Math.floor(parsedNumber);
}

async function getTikTokVideoCount() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();


  const tiktokUrl = process.env.TIKTOK_EFFECT_URL;
  try {
    await page.goto(tiktokUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await page.waitForSelector('h2[title="views"]', { timeout: 10000 });

    const videoCountText = await page.evaluate(() => {
      const element = document.querySelector('h2[title="views"]');
      return element ? element.textContent.trim() : null;
    });

    if (videoCountText) {
      const videoCount = parseVideoCount(videoCountText);
      if (videoCount !== null) {
        db.run('INSERT INTO video_counts (count) VALUES (?)', [videoCount], (err) => {
          if (err) {
            console.error('Error inserting into database:', err.message);
          } else {
            console.log('Video count stored:', videoCount);
          }
        });
        return videoCount;
      } else {
        console.log('Unable to parse video count.');
      }
    } else {
      console.log('Video count not found.');
    }
  } catch (error) {
    console.error('Error scraping TikTok video count:', error.message);
  } finally {
    await browser.close();
  }
  return null;
}

async function main() {
  await getTikTokVideoCount();
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    }
  });
}

main();
