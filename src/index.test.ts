import { Api } from ".";
import { expect, test } from "bun:test";

class HelloWorld {
  app?: Api;
  setup(app: Api) {
    this.app = app;
    app.addRoute("hello-world", this.fetch.bind(this));
  }

  async fetch(request: Request) {
    const url = new URL(request.url);
    const name = url.searchParams.get("name");
    return new Response(JSON.stringify({ message: `Hello ${name}` }), {
      headers: this.app!.headers,
    });
  }
}

const app = new Api({
  plugins: {
    helloWorld: new HelloWorld(),
  },
});

test("Hello World", async () => {
  const url = new URL("http://localhost:3000/hello-world");
  url.searchParams.set("name", "World");
  const response = await app.app.fetch(new Request(url.toString()));
  const result = await response.json();
  expect(result.message).toBe("Hello World");
});
