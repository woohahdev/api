# @woohahdev/api

WOOHAH API Base

```ts
class HelloWorld {
  app!: Api;

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

Bun.serve(app.app);
```
