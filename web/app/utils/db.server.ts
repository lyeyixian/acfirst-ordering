import admin from "firebase-admin";
import {
  applicationDefault,
  initializeApp as initializeAdminApp,
} from 'firebase-admin/app';
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  signOut,
} from "firebase/auth";

require("dotenv").config();

// Your web app's Firebase configuration
const firebaseConfig = {
  // config goes here
  apiKey: "AIzaSyDgPsZIA0MBIozUrI-AmGrLau8sOWb9DPs",
  authDomain: "acfirst-ordering.firebaseapp.com",
  databaseURL: "https://acfirst-ordering-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "acfirst-ordering",
  storageBucket: "acfirst-ordering.appspot.com",
  messagingSenderId: "291148148385",
  appId: "1:291148148385:web:610455e12b93261f874ae0",
  measurementId: "G-XJW9CNEFTV"
};

if (!admin.apps.length) {
  initializeAdminApp({
    credential: applicationDefault(),
    databaseURL: "https://acfirst-ordering-default-rtdb.asia-southeast1.firebasedatabase.app",
  });
}

const db = admin.firestore();

const adminAuth = admin.auth();
initializeApp(firebaseConfig);

async function signIn(email: string, password: string) {
  const auth = getAuth();
  return signInWithEmailAndPassword(auth, email, password);
}

async function signUp(email: string, password: string) {
  const auth = getAuth();
  return createUserWithEmailAndPassword(auth, email, password);
}

async function createUserDocument(username: string, payload: any) {
  db.collection("users").doc(username).set(payload);
}


async function getSessionToken(idToken: string) {
  const decodedToken = await adminAuth.verifyIdToken(idToken);
  if (new Date().getTime() / 1000 - decodedToken.auth_time > 5 * 60) {
    throw new Error("Recent sign in required");
  }
  const twoWeeks = 60 * 60 * 24 * 14 * 1000;
  return adminAuth.createSessionCookie(idToken, { expiresIn: twoWeeks });
}

async function signOutFirebase() {
  await signOut(getAuth());
}

export { db, signUp, getSessionToken, signOutFirebase, signIn, createUserDocument, adminAuth };
