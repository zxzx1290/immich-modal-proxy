export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // Intercept /, directly respond with "hello world"
        if (url.pathname === "/") {
            return new Response("hello world", {
                headers: { "Content-Type": "text/plain" },
            });
        }

        // Intercept /ping, respond directly without forwarding to Modal
        if (url.pathname === "/ping") {
            return new Response("pong", {
                headers: { "Content-Type": "text/plain" },
            });
        }

        // Only forward POST /predict to Modal
        if (request.method === "POST" && url.pathname === "/predict") {
            const modalUrl = env.MODAL_URL + url.pathname + url.search;

            const headers = new Headers(request.headers);
            headers.set("X-Modal-Proxy-Key", env.MODAL_PROXY_KEY);

            return fetch(modalUrl, {
                method: request.method,
                headers,
                body: request.body,
            });
        }

        // All other requests return 404
        return new Response(null, { status: 404 });
    },
};