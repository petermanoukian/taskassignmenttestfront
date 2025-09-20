export interface AppConfig {
  apiBaseUrl: string;
  baseUrl: string;
  appName: string;
}

const config: AppConfig = {
  apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  baseUrl: import.meta.env.VITE_WEB_URL || 'http://localhost:8000',
  appName: import.meta.env.VITE_APP_NAME || 'Taskmanagemtent',
};


export default config;

