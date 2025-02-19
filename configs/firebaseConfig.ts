import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBhg3rvTVyJ9LZuLtmaz2b9ZWy8FL6jqB8",
  authDomain: "estiam-test-62b75.firebaseapp.com",
  projectId: "estiam-test-62b75",
  storageBucket: "estiam-test-62b75.firebasestorage.app",
  messagingSenderId: "430629029880",
  appId: "1:430629029880:web:f0a5b726c66b27ceb3780d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);

export default app;
