/**
 * @typedef {import("@cloudflare/workers-types")}
 */

const CORS_HEADER = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
  "Access-Control-Allow-Headers":
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers",
};

/**
 *
 * @param {URL} url
 * @returns {Promise<Response>}
 */
async function getRequest(url) {
  const requestedJSON = url.pathname.replace("/", "");
  if (requestedJSON === "") {
    return new Response(
      JSON.stringify(
        {
          error: {
            message: "you need to provide a path to request a json",
          },
        },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...CORS_HEADER,
          },
        }
      )
    );
  }

  if (requestedJSON === "version") {
    const dataVersion = await KVStore.get("dataVersion");
    return new Response(JSON.stringify({ dataVersion }), {
      headers: {
        "Content-Type": "application/json",
        ...CORS_HEADER,
      },
    });
  }

  const jsonString = await KVStore.get(requestedJSON);
  if (!jsonString) {
    return new Response(
      JSON.stringify({
        error: { message: `no json found with name ${requestedJSON}` },
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...CORS_HEADER,
        },
      }
    );
  }

  return new Response(jsonString, {
    headers: {
      "Content-Type": "application/json",
      ...CORS_HEADER,
    },
  });
}

/**
 *
 * @param {URL} url
 * @param {any} body
 * @returns {Promise<Response>}
 */
async function postRequest(url, body) {
  const { searchParams } = url;
  const jsonKey = searchParams.get("key");

  const jsonString = JSON.stringify(body);
  const dataVersion = Number(await KVStore.get("dataVersion"));

  await KVStore.put(jsonKey, jsonString);
  await KVStore.put("dataVersion", dataVersion + 1);

  return new Response(
    JSON.stringify({ success: true, dataVersion: dataVersion + 1, data: body }),
    {
      headers: {
        "Content-Type": "application/json",
        ...CORS_HEADER,
      },
    }
  );
}

/**
 *
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function handleRequest(request) {
  const url = new URL(request.url);
  const { headers } = request;
  const contentType = headers.get("Content-Type") || "";

  if (request.method === "POST") {
    if (contentType !== "application/json") {
      return new Response(
        JSON.stringify({
          error: {
            message:
              "Body must be of content-type application/json. Check data or headers",
          },
        }),
        {
          headers: {
            ...CORS_HEADER,
          },
        }
      );
    }
    const body = await request.json();
    const postResponse = postRequest(url, body);
    return postResponse;
  }
  const getResponse = getRequest(url);
  return getResponse;
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
