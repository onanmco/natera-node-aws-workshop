const http = require("http");
const url = require("url");

http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  switch (path) {
    case "/hello":
      switch (req.method) {
        case "GET":
          const queryParams = parsedUrl.query;
          const { name } = queryParams;

          console.log(queryParams)
          console.log(typeof queryParams)

          if (!name) {
            res.statusCode = 400;
            return res.end("\"name\" is required body parameter.");
          }

          res.statusCode = 200;
          res.end(`Hello ${name}`);
          
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