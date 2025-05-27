export interface ApiOptions {
  plugins: Record<string, { setup: (app: Api) => void }>;
}

export class Api {
  routes: Map<string, (request: Request) => Promise<Response>> = new Map();
  plugins: ApiOptions["plugins"] = {};

  constructor(options: ApiOptions) {
    this.plugins = options.plugins;
    for (const plugin of Object.values(this.plugins)) {
      plugin.setup(this);
    }
  }

  get app() {
    return {
      fetch: this.fetch.bind(this),
    };
  }

  addRoute(id: string, route: (request: Request) => Promise<Response>) {
    this.routes.set(id, route);
  }

  get headers() {
    return {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };
  }

  async fetch(request: Request) {
    try {
      const url = new URL(request.url);
      const [_, routeId] = url.pathname.split("/");

      const route = this.routes.get(routeId);

      if (route) {
        return route(request);
      } else {
        return new Response("Not Found", {
          status: 404,
          headers: this.headers,
        });
      }
    } catch (error) {
      console.error(error);
      return new Response(String(error), {
        status: 500,
        headers: this.headers,
      });
    }
  }
}
