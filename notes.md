## Wrapping `fetch` requests with CSRF

Your Express backend server is configured to be CSRF protected and will only accept requests that have the right CSRF secret token in a header and the right CSRF token value in a cookie.

First, you need to add a "proxy" in your frontend/vite.config.js file. In the function being passed to defineConfig, add a server key after the plugins key. The server key should point to an object with a proxy key pointing to another object. The proxy object defines proxies by specifying the routes to be proxied as keys and the urls to which they should be redirected as the values. Set a proxy to send /api routes to http://localhost:8000 (or wherever you are serving your backend Express application).

This proxy will force the frontend server to act like it's being served from the backend server. So if you do a fetch request in the React frontend like fetch('/api/csrf/restore), then the GET /api/csrf/restore request will be made to the backend server instead of the frontend server.


Next, to make fetch requests with any HTTP verb other than GET, you need to set an XSRF-TOKEN header on the request.
The value of the header should be set to the value of the XSRF-TOKEN cookie.
To do this, you are going to wrap the fetch function on the window that will be used in place of the default fetch function.


## Restore the XSRF-TOKEN cookie
