import express from "express";
import { User } from "../common/User";
import { UserService } from "./UserService";
import { Ack } from "../common/Ack";
import { Reply } from "../common/Reply";
import { Thread } from "../common/Thread";
import { ThreadService } from "./threadService";

const fvServer = express();
const PORT = 3000;  // don't change, that's used in common/fvUrls

let threadService = new ThreadService();

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
});

fvServer.put('/login', (req, res) => {
	let ack = UserService.tryLoginUser(User.fromAny(req.body));
	res.send(ack);
});

fvServer.get('/threads', (req, res) => {
  res.send(JSON.stringify(threadService.getThreads()));
});

fvServer.get('/thread/:thread', (req, res) => {
  let thread_id = parseInt(req.params.thread);
  res.send(JSON.stringify(threadService.getThreadByID(thread_id)));
});

fvServer.post('/thread',(req,res) => {
  let thread: Thread = <Thread> req.body;
  let ack: Ack = threadService.tryCreateThread(thread);
  res.send(ack);
});

fvServer.put('/thread/:thread',(req,res) => {
  let thread_id: number = parseInt(req.params.thread);
  let reply: Reply =  <Reply>req.body;
  
  let ack: Ack = threadService.trySendReply(reply, thread_id);
  res.send(ack);
});



// for tests
fvServer.get('/clear_users', (req, res) => {
	let code = UserService._clearRegisteredUsers();
	res.send(code);
})

fvServer.listen(PORT, () => {
  console.log(`Forumverse Server listening on port ${PORT}!`)
})
