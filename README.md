# Decade Golf Tracker

A mobile-first Progressive Web App for tracking golf statistics using Scott Fawcett's Decade Golf strokes gained methodology.

## Features

- **Shot-by-shot tracking**: Record every tee shot, approach, short game shot, and putt
- **Auto-calculated Strokes Gained**: Real-time SG calculation against PGA Tour benchmarks
- **SG Breakdown**: Track SG: OTT, APP, ARG, and PUTT separately
- **Traditional Stats**: FIR%, GIR%, Total Putts, Penalties
- **Historical Data**: View trends and compare rounds over time
- **Mobile-First Design**: Optimized for on-course use on your phone
- **Offline Support**: Works without internet (data syncs when connected)
- **PWA**: Install as an app on your phone

## Tech Stack

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore (or localStorage for offline-first)
- **Deployment**: Vercel
- **Icons**: Lucide React

## Quick Start (Local Development)

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Option 1: Deploy with Firebase (Recommended for cloud sync)

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Firestore Database
   - Create a Web App and copy the config

2. **Set Environment Variables in Vercel**:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=xxx
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
   NEXT_PUBLIC_FIREBASE_APP_ID=xxx
   ```

3. **Deploy**:
   ```bash
   npm install -g vercel
   vercel
   ```

### Option 2: Deploy with LocalStorage Only (No Firebase needed)

The app works out of the box with localStorage. Just deploy:

```bash
vercel
```

Data will be stored in your browser's localStorage.

## Firebase Setup (Detailed)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Name it (e.g., "decade-golf-tracker")
4. Disable Google Analytics (optional)
5. Click "Create project"

### Enable Firestore:
1. In your project, click "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to you
5. Click "Enable"

### Get your config:
1. Click the gear icon > Project settings
2. Scroll to "Your apps"
3. Click the Web icon (</>)
4. Register your app
5. Copy the `firebaseConfig` values

### Firestore Security Rules (Production)

For production, update your Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write to all documents (single user app)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main app component
├── components/
│   ├── Dashboard.tsx    # Home screen with stats
│   ├── NewRound.tsx     # Start new round form
│   ├── RoundEntry.tsx   # Shot-by-shot entry
│   ├── RoundHistory.tsx # Past rounds list
│   └── shots/
│       ├── TeeShotEntry.tsx
│       ├── ApproachEntry.tsx
│       ├── ShortGameEntry.tsx
│       └── PuttEntry.tsx
├── lib/
│   ├── firebase.ts      # Firebase configuration
│   ├── sg-calculator.ts # Strokes gained calculations
│   └── types.ts         # TypeScript types
└── data/
    └── benchmarks.ts    # PGA Tour benchmark data
```

## Strokes Gained Methodology

This app implements the Decade Golf system which uses PGA Tour average strokes-to-hole-out from every position on the course:

- **Tee Shots**: Starting benchmark based on hole distance/par, ending benchmark based on lie and distance remaining
- **Approaches**: Starting benchmark based on distance and lie, ending benchmark based on proximity to hole
- **Short Game**: Starting benchmark based on distance and lie type (fringe, rough, bunker), ending benchmark based on proximity
- **Putting**: Starting benchmark based on putt distance, ending benchmark is 0 (holed) or remaining putt distance

**Formula**: `SG = Starting Benchmark - Ending Benchmark - 1`

A positive SG means you gained strokes on the field, negative means you lost strokes.

## Customization

### Adding New Benchmarks

Edit `src/data/benchmarks.ts` to add or modify benchmark data.

### Changing UI Theme

Edit `tailwind.config.js` and `src/app/globals.css` for colors and styling.

## License

MIT
