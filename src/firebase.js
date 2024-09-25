import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // getAuth를 import 추가

const firebaseConfig = {
  apiKey: "AIzaSyBXEZ_C1TVjBMJNXw6KgvS-PIQ3AnoGT1g",
  authDomain: "team-project-12345.firebaseapp.com",
  databaseURL: "https://team-project-12345-default-rtdb.firebaseio.com",
  projectId: "team-project-12345",
  storageBucket: "team-project-12345.appspot.com",
  messagingSenderId: "1099369570636",
  appId: "1:1099369570636:web:34e06442b49407c14e2fe9",
  measurementId: "G-NERBR2VEQQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Auth 객체 생성
const auth = getAuth(app);

// auth 내보내기
export { auth };