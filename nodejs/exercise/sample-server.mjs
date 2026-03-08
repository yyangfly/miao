import { createServer } from "http";

createServer((request, response) => {
  if (request.url === "/data") {
    const accept = request.headers["accept"];
    if (accept.includes("application/json")) {
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({name: "frank", weight: 70, gender: "man"}));
    } else if (accept.includes("text/html")) {
      response.setHeader("Content-Type", "text/html");
      response.end(`<h1>frank, weight is 70, gender is man.<h1>`);
    } else {
      response.setHeader("Content-Type", "text/plain");
      response.end(`frank, weight is 70, gender is man.`);
    }
  }
}).listen(8000);