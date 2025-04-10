import { WoohahApi } from ".";
import { expect, test } from "bun:test";

class HelloWorld {
  setup(app: WoohahApi) {
    app.registerRoute("hello-world", async (request) => {
      return new Response(JSON.stringify({ message: "Hello World" }), {
        headers: app.headers,
      });
    });
  }
}

const app = new WoohahApi({
  plugins: {
    helloWorld: new HelloWorld(),
  },
});

test("Hello World", async () => {
  const response = await app.fetch(
    new Request("http://localhost:3000/hello-world"),
  );
  const result = await response.json();

  expect(result.message).toBe("Hello World");
});
