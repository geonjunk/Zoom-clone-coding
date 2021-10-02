const express=require(`express`);
const app=express();
const http=require(`http`);
const { parse } = require("path");
const WebSocket=require(`ws`);
const SocketIO = require(`socket.io`);

app.set("view engine","pug");
app.set("views",__dirname+`/views`);
app.use("/public",express.static(__dirname+"/public"));//정적 파일 제공
app.get(`/`,(req,res)=>res.render("home"));
app.get("/*",(req,res)=>res.redirect("/"));

//webRtc
const httpServer=http.createServer(app);
const wsServer=SocketIO(httpServer);

wsServer.on("connection",socket=>{
    socket.on("join_room",(roomName)=>{
        socket.join(roomName);
        socket.to(roomName).emit("welcome");
    });
    socket.on("offer",(offer,roomName)=>{
        socket.to(roomName).emit("offer",offer);
    });
    socket.on("answer",(answer,roomName)=>{
        socket.to(roomName).emit("answer",answer);
    });
    socket.on("ice",(ice,roomName)=>{
        socket.to(roomName).emit("ice",ice);
    })
});

//socket io 이용
/*
const httpServer=http.createServer(app);
const wsServer = new Server(httpServer, {
    cors: {
      origin: ["https://admin.socket.io"],
      credentials: true,
    },
  });
  
  instrument(wsServer, {
    auth: false,
  });
//socket io 설치만으로 url을 생성함 : 현재 url/socket.io/socket.io.js
const publicRooms=()=>{
    const {sockets:{adapter:{sids,rooms}}}=wsServer;//socket과 room 가져옴
    const publicRooms=[];
    rooms.forEach((_,key)=>{
        if(sids.get(key)===undefined){
            publicRooms.push(key);
        }
    });
    return publicRooms;
}
const countRoom=(roomName)=>{
   return wsServer.sockets.adapter.rooms.get(roomName)?.size;//sometime 반환 안 할 수 있음
}
wsServer.on("connection",(socket)=>{
    socket["nickname"]="Anon";
    socket.onAny((event)=>{
        console.log(wsServer.sockets.adapter);
        console.log(`socket Event : ${event}`);
    })
    socket.on("enter_room",(roomName,done)=>{
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome",socket.nickname,countRoom(roomName));
        wsServer.sockets.emit("room_change",publicRooms());
    });
    socket.on("disconnecting",()=>{
        socket.rooms.forEach((room)=>{
            socket.to(room).emit("bye",socket.nickname,countRoom(room)-1);
        });
       
    });
    socket.on("disconnect",()=>{
        wsServer.sockets.emit("room_change",publicRooms());
    })
    socket.on("new_message",(msg,room,done)=>{
        socket.to(room).emit("new_message",`${socket.nickname} : ${msg}`);
        done();
    })
    socket.on("nickname",(nickname)=>(socket["nickname"]=nickname));
});
*/

//ws
/*
const handleListen=()=>console.log(`Listening on http and ws://localhost:3000`)
const server =http.createServer(app);//여기서 서버를 만들건데 express application으로 부터 서버를 만든다 이건 http 서버
const wss= new WebSocket.Server({server});// 여기서부터 ws 서버
//둘다 http 서버와 ws서버 같이 돌리수 있음 (2개가 같은 포트에 있긴원하기에 이렇게 하는거 필수 사항은 아님)
//http서버 위에 ws서버를 만들 수 있게한거임, 2개의 프로토콜이 다 같은 port를 공유
const sockets=[];//연결된 브라우저 구별하기위해

wss.on("connection",(socket)=>{
    sockets.push(socket);
    socket["nickname"]="anono";
    console.log("connected to Browser")
    socket.on("close",()=> console.log("Disconnected from the Browser"));//브라우저 껐을 때 이벤트 발생
    socket.on("message",(msg)=>{
        const message=JSON.parse(msg);
        switch(message.type){
            case "new_message":
                sockets.forEach((aSocket)=>aSocket.send(`${socket.nickname}: ${message.payload}`));//한 브라우저에서 메시지 받았을 때 다른 브라우저에도 보냄
            case "nickname":
                socket["nickname"]=message.payload;//socket안에 정보를 저장할 수있음
        }   
    });
});//누구와 연결됐을때
//callback으로 socket받음 -> socket은 backend에 연결된 어떤 사람의 정보를 제공 (어떤 것과 연결된 라인)
//여기서 socket은 프론트와 연결된 소켓
//2개이상의 브라우저와 한서버 연결가능
*/
httpServer.listen(3000);

//2가지 type의 data를 구별해서 보내줘야함(nick , message)