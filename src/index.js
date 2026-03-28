export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // 攔截 /，直接回應 "hello world"
        if (url.pathname === "/") {
            return new Response("hello world", {
                headers: { "Content-Type": "text/plain" },
            });
        }

        // 攔截常見的瀏覽器自動請求
        const ignoredPaths = [
            "/favicon.ico",
            "/favicon.png",
            "/apple-touch-icon.png",
            "/apple-touch-icon-precomposed.png",
            "/robots.txt",
            "/sitemap.xml",
            "/.well-known/",
            "/manifest.json",
            "/browserconfig.xml",
        ];
        if (ignoredPaths.some((p) => url.pathname.startsWith(p))) {
            return new Response(null, { status: 404 });
        }

        // 攔截 /ping，直接回應不轉發到 Modal
        if (url.pathname === "/ping") {
            return new Response(JSON.stringify({ message: "pong" }), {
                headers: { "Content-Type": "application/json" },
            });
        }

        // 僅 POST /predict 轉發到 Modal
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

        // 其餘請求回傳 404
        return new Response(null, { status: 404 });
    },
};