import { VERSION } from "../shared/version.ts";
import { Application } from "./imports/oak.ts";
import { join } from "../../imports/path.ts";
import { htmlBody } from "./templates.ts";
import { ServerProps } from "./types.ts";

let Module: any;

async function DeployServer({ clientPath, mode }: ServerProps) {
  const server = new Application();

  server.use(async ({ response, request }) => {
    try {
      const { pathname, search, searchParams } = request.url;

      const App = Module;

      response.headers.set("X-Powered-By", `Snel v${VERSION}`);

      if (request.method === "GET") {
        if (request.url.pathname === "/Snel/client" && clientPath) {
          response.headers.set("content-type", "application/javascript");

          const client = new TextDecoder("utf-8").decode(
            await Deno.readFile(join(Deno.cwd(), clientPath!))
          );

          response.body = client;
        } else {
          response.headers.set("content-type", "text/html");
          response.status = 200;
          let sendData = false;

          const { css, head, html } = App.render({
            Request: {
              PathName: pathname,
              Search: search,
              SearchParams: searchParams,
            },
            Response: {
              status(code = 200) {
                response.status = code;
                return this;
              },
              json(data = {}) {
                response.body = JSON.stringify(data, null, 2);
                response.headers.set("content-type", "application/json");
                sendData = true;
                return this;
              },
              send(data = "") {
                response.body = data;
                sendData = true;
                return this;
              },
              headers: {
                set(name = "", value = "") {
                  response.headers.set(name, value);
                  return this;
                },
                get(name = "") {
                  return response.headers.get(name);
                },
              },
            },
          });

          if (!sendData) {
            response.body = htmlBody({
              html,
              head,
              css: css.code,
              client: mode === "ssr" ? "Snel/client" : null,
            });
          }
        }
      } else {
        response.status = 405;
        response.headers.set("content-type", "text/html");
        response.body = "<h1>this method is not allowed, only GET method</h1>";
      }
    } catch (error) {
      console.log(error);
      response.status = 500;
      response.headers.set("content-type", "text/html");
      response.body = "<h1>Snel internal server Error</h1>";
    }
  });

  return server;
}

export function denoDeploy(clientPath: string) {
  return `// generated by snel v${VERSION}
import { htmlBody } from "https://deno.land/x/snel@v${VERSION}/src/server_side/templates.ts";
import { VERSION } from "https://deno.land/x/snel@v${VERSION}/src/shared/version.ts";
import { Application } from "https://deno.land/x/oak@v7.6.3/mod.ts ";
import { join } from "https://deno.land/std@0.106.0/path/mod.ts";
import Module from "${clientPath}";

${DeployServer.toString()}

const Server = await DeployServer({ clientPath: null, mode: "ssg" });

addEventListener("fetch", Server.fetchEventHandler());
`;
}
