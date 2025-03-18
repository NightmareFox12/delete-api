import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

export const initializeFirebase = () => {
  const app = initializeApp(firebaseConfig);
  getAuth(app);
};
