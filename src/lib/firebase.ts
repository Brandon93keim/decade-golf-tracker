import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc,
  query, 
  orderBy,
  Firestore 
} from 'firebase/firestore';
import { Round, ActiveRound } from './types';

// Firebase config - you'll need to replace these with your own values
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Initialize Firebase
let app: FirebaseApp;
let db: Firestore;

function initFirebase() {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
  return { app, db };
}

// Get Firestore instance
export function getDb(): Firestore {
  if (!db) {
    initFirebase();
  }
  return db;
}

// Round operations
export async function saveRound(round: Round): Promise<void> {
  const db = getDb();
  await setDoc(doc(db, 'rounds', round.id), round);
}

export async function getRound(id: string): Promise<Round | null> {
  const db = getDb();
  const docSnap = await getDoc(doc(db, 'rounds', id));
  if (docSnap.exists()) {
    return docSnap.data() as Round;
  }
  return null;
}

export async function getAllRounds(): Promise<Round[]> {
  const db = getDb();
  const q = query(collection(db, 'rounds'), orderBy('date', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Round);
}

export async function deleteRound(id: string): Promise<void> {
  const db = getDb();
  await deleteDoc(doc(db, 'rounds', id));
}

// Active round (for in-progress rounds)
export async function saveActiveRound(round: ActiveRound): Promise<void> {
  const db = getDb();
  await setDoc(doc(db, 'activeRound', 'current'), round);
}

export async function getActiveRound(): Promise<ActiveRound | null> {
  const db = getDb();
  const docSnap = await getDoc(doc(db, 'activeRound', 'current'));
  if (docSnap.exists()) {
    return docSnap.data() as ActiveRound;
  }
  return null;
}

export async function clearActiveRound(): Promise<void> {
  const db = getDb();
  await deleteDoc(doc(db, 'activeRound', 'current'));
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
