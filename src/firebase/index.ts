import { FirebaseOptions, initializeApp } from "firebase/app";
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from "firebase/firestore/lite";

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const justJoinItLogs = collection(db, "just-join-it-logs");
const q = query(justJoinItLogs, orderBy("timestamp", "asc"));
const getJustJoinItLogs = async () => {
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const { timestamp, ...data } = doc.data();
    return {
      // id: doc.id, // Include the document ID if needed
      ...data, // Include the document data
      timestamp: new Date(
        timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
      ),
    };
  });
};

console.log(import.meta.env);

export { getJustJoinItLogs };
