const express=require(`express`);
const app=express();
const http=require(`http`);
const WebSocket=require(`ws`);

app.set("view engine","pug");
app.set("views",__dirname+`/views`);
app.use("/public",express.static(__dirname+"/public"));//정적 파일 제공
app.get(`/`,(req,res)=>res.render("home"));
app.get("/*",(req,res)=>res.redirect("/"));


const handleListen=()=>console.log(`Listening on http and ws://localhost:3000`)
const server =http.createServer(app);//여기서 서버를 만들건데 express application으로 부터 서버를 만든다 이건 http 서버
const wss= new WebSocket.Server({server});// 여기서부터 ws 서버
//둘다 http 서버와 ws서버 같이 돌리수 있음 (2개가 같은 포트에 있긴원하기에 이렇게 하는거 필수 사항은 아님)
//http서버 위에 ws서버를 만들 수 있게한거임, 2개의 프로토콜이 다 같은 port를 공유

wss.on("connection",(socket)=>{
    console.log(socket);
});//누구와 연결됐을때
//callback으로 socket받음 -> socket은 backend에 연결된 어떤 사람의 정보를 제공 (어떤 것과 연결된 라인)
//여기서 socket은 연결된 브라우저
server.listen(3000,handleListen);