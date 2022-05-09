import express from "express";
import { User } from "../common/User";
import { UserService } from "./UserService";
import { Ack } from "../common/Ack";
import { Reply } from "../common/Reply";
import { Thread } from "../common/Thread";
import { ThreadService } from "./threadService";
import { Util } from "./util";
import { SERVER_PORT } from "../common/fvUrls"

const fvServer = express();

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
  let thread_id = req.params.thread;
  thread_id = Util.getParameter(thread_id);

  res.send(JSON.stringify(threadService.getThreadByID(parseInt(thread_id))));
});

fvServer.post('/thread',(req,res) => {
  let thread: Thread = <Thread> req.body;
  let ack: Ack = threadService.tryCreateThread(thread);
  res.send(ack);
});


fvServer.put('/newreply/:thread',(req,res) => {
  let thread_id: number = parseInt(Util.getParameter(req.params.thread));
  let reply: Reply =  <Reply>req.body;
  
  let ack: Ack = threadService.trySendReply(reply, thread_id);
  res.send(ack);
});

fvServer.delete('/thread/:thread/:user', (req,res) => {
  let thread_id: number = parseInt(Util.getParameter(req.params.thread));
  let user: User = <User>UserService.getUserByName(Util.getParameter(req.params.user));
  
  let ack: Ack = threadService.DeleteThreadById(thread_id, user);
  res.send(ack);
});

fvServer.delete('/deletereply/:thread/:reply/:user', (req,res) => {
  let thread_id: number = parseInt(Util.getParameter(req.params.thread));
  let reply_id: number = parseInt(Util.getParameter(req.params.reply));
  let user: User = <User>UserService.getUserByName(Util.getParameter(req.params.user));
  
  let ack: Ack = threadService.DeleteReplyById(reply_id, thread_id, user);
  res.send(ack);
});

// Lock and unlock threads
fvServer.put('/thread/:thread/:wannaLock',(req,res) => {
  let thread_id: number = parseInt(Util.getParameter(req.params.thread));
  let wannaLock: boolean = (Util.getParameter(req.params.wannaLock) == 'true');
  let user: User =  <User>req.body;
  
  let ack: Ack = threadService.toggleLockThreadById(thread_id, user, wannaLock);
  res.send(ack);
});

// for tests
fvServer.get('/clear_users', (req, res) => {
	let code = UserService._clearRegisteredUsers();
	res.sendStatus(code);
});

fvServer.get('/clear_threads', (req, res) => {
	let code = threadService._clear();
	res.sendStatus(code);
});

fvServer.listen(SERVER_PORT, () => {
  console.log(`Forumverse Server listening on port ${SERVER_PORT}!`)
});
