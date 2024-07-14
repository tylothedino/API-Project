import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

//Your Express backend server is configured to be CSRF protected and will only accept requests that have the right CSRF secret token in a header and the right CSRF token value in a cookie.

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    eslint({
      lintOnStart: true,
      failOnError: mode === "production"
    })
  ],
  //Add a <proxy>
  server: {
    /*
      The proxy object defines proxies by specifying the routes to be proxied as keys in the urls to which they should be redirected as values
        -> Set a proxy to send /api routes to: http://localhost:8000

      This proxy will force the frontend server to act like it's being served from the backend server
        -> So if you do a fetch request in the React frontend (i.e: fetch('/api/csrf/restore))
          then the [GET: /api/csrf/restore] will be made to the backend server instead of the frontend server
    */
    proxy: {
      '/api': 'http://localhost:8000'
    },
  }
}));
