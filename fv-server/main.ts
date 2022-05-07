import express from "express";
import { User } from "../common/User";
import { UserService } from "./UserService";

const fvServer = express();
const PORT = 3000;  // don't change, that's used in common/fvUrls

var allowCrossDomain = function(req: any, res: any, next: any) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
fvServer.use(allowCrossDomain);

fvServer.use(express.json());

// PUT: modify existing resource
// POST: add new resource
fvServer.post('/register', (req, res) => {
	let ack = UserService.tryRegisterUser(User.fromAny(req.body));
	res.send(ack);
})

fvServer.put('/login', (req, res) => {
	let ack = UserService.tryLoginUser(User.fromAny(req.body));
	res.send(ack);
})

// for tests
fvServer.get('/clear_users', (req, res) => {
	let code = UserService._clearRegisteredUsers();
	res.send(code);
})

fvServer.listen(PORT, () => {
  console.log(`Forumverse Server listening on port ${PORT}!`)
})
