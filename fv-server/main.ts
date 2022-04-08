import express from "express";

const fvServer = express();
const port = 3000;

fvServer.get('/', (req, res) => {
  res.send('Hello World!');
});

fvServer.listen(port, () => {
  console.log(`Forumverse Server listening on port ${port}!`)
})
