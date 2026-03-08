import { createServer } from "node:http";
import { resolve, sep } from "node:path";
import { createReadStream, createWriteStream, mkdir } from "node:fs";
import { stat, readdir, rmdir, unlink } from "node:fs/promises";
import { contentType } from "mime-types";

const PORT = 8000;
const baseDirectory = process.cwd();
const methods = Object.create(null);

methods.GET = async function (request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != "ENOENT")
      throw error;
    else
      return { status: 404, body: "File not found" };
  }
  if (stats.isDirectory()) {
    return { body: (await readdir(path)).join("\n") };
  } else {
    return {
      body: createReadStream(path),
      type: contentType(path)
    };
  }
};

methods.DELETE = async function (request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != "ENOENT")
      throw error;
    else
      return { status: 204 };
  }
  if (stats.isDirectory())
    await rmdir(path);
  else
    await unlink(path);
  return { status: 204 };
};

methods.PUT = async function (request) {
  let path = urlPath(request.url);
  await pipeStream(request, createWriteStream(path));
  return { status: 204 };
}

function pipeStream(from, to) {
  return new Promise((resolve, reject) => {
    from.on("error", reject);
    to.on("error", reject);
    to.on("finish", resolve);
    from.pipe(to);
  });
}

methods.MKCOL = async function (request) {
  let path = urlPath(request.url);
  let stats;

  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code === "ENOENT") {
      mkdir(path, { recursive: true }, (err) => {
        if (err)
          throw err;
      });
      return { status: 204 };
    } else {
      throw error;
    }
  }

  if (stats.isDirectory()) {
    return { status: 204 };
  } else {
    return { status: 400 } 
  }
}

createServer((request, response) => {
  console.log(request.method, request.url);
  let handler = methods[request.method] || notAllowed;
  handler(request).catch(error => {
    if (error.status != null)
      return error;
    else
      return { body: String(error), status: 500 };
  }).then(({ body, status = 200, type = "text/plain" }) => {
    response.writeHead(status, { "Content-Type": type });
    if (body?.pipe)
      body.pipe(response);
    else
      response.end(body);
  });
}).listen(PORT, () => {
  // 这里的代码只有在真正监听成功后才会执行
  console.log(`✅ 服务启动成功！`);
  console.log(`👉 正在监听端口: ${PORT}`);
  console.log(`🌐 请在浏览器中访问: http://localhost:${PORT}`);
});

async function notAllowed(request) {
  return {
    status: 405,
    body: `Method ${request.method} not allowed.`
  }
}

function urlPath(url) {
  let { pathname } = new URL(url, "http://d");
  let path = resolve(decodeURIComponent(pathname).slice(1));
  if (path != baseDirectory && !path.startsWith(baseDirectory + sep)) {
    throw { status: 403, body: "Forbidden" };
  }
  return path;
}