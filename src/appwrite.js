import { Client, Account, Databases, Functions, Storage} from 'appwrite';

// Inisialisasi Klien Appwrite
const client = new Client();

client
    .setEndpoint('https://nyc.cloud.appwrite.io/v1') // Endpoint API Appwrite Anda
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID) // Project ID dari .env.local
    .setDevKey(import.meta.env.VITE_APPWRITE_DEV_KEY);

// Buat instance untuk Akun (Authentication)
export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);
export const storage = new Storage(client);

export default client;