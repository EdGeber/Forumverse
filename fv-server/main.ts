import express from "express";

const fvServer = express();
const PORT = 3000;

var allowCrossDomain = function(req: any, res: any, next: any) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
fvServer.use(allowCrossDomain);

fvServer.use(express.json());

fvServer.get('/', (req, res) => {
  res.send('Hello World!');
});

fvServer.listen(PORT, () => {
  console.log(`Forumverse Server listening on port ${PORT}!`)
})
