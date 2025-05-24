// note: only use path to project root during design/testing, the search function doesn't work on it.
const publicPath = "/Users/kylakreal/Kproxy-main/";
//const publicPath = "/Users/kylakreal/Kproxy-main/Ultraviolet-Static/public";

export default async function settings_router(fastify, options) {
    fastify.get("/", (req, res) => {
	    return res.sendFile("frontend-files/pages/settings.html", publicPath);
    });
    fastify.get("/ui", (req, res) => {
	    return res.sendFile("frontend-files/pages/settings-pages/settings-ui.html", publicPath);
    });
    fastify.get("/cloaking", (req, res) => {
	    return res.sendFile("frontend-files/pages/settings-pages/settings-cloaking.html", publicPath);
    });
    fastify.get("/color", (req, res) => {
	    return res.sendFile("frontend-files/pages/settings-pages/settings-color.html", publicPath);
    });
    fastify.get("/particles", (req, res) => {
	    return res.sendFile("frontend-files/pages/settings-pages/settings-particles.html", publicPath);
    });
}