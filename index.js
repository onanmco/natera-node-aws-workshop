const http = require("http");
const url = require("url");

http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  const path = parsedUrl.pathname;

  switch (path) {
    case "/hello":
      switch (req.method) {
        case "POST":

          const chunks = [];

          req.on("data", (chunk) => {
            chunks.push(chunk);
          })

          req.on("end", () => {
            const body = Buffer.concat(chunks)
              .toString("utf-8")

            const parsedBody = JSON.parse(body);

            console.log(typeof parsedBody);
            console.log(parsedBody);

            const {
              name
            } = parsedBody;

            if (!name) {
              res.statusCode = 400;
              return res.end("name is required body parameter.");
            }

            res.statusCode = 200;
            return res.end(`Hello ${name}`);
          })
          
          
          break;
      
        default:
          res.statusCode = 405;
          res.end("Method not allowed.");
          break;
      }
      break;
  
    default:
      res.statusCode = 404;
      res.end("request url not found");
      break;
  }
})
  .listen(3000, function() {
    console.log("Server is started working on port number: 3000");
  })