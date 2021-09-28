const messageList = document.querySelector("ul");
const nickForm=document.querySelector("#nick");
const messageForm = document.querySelector("#message");

const socket =new WebSocket(`ws://${window.location.host}`);
//프론트에선 브라우저에 대한 ws 가 implementation이 되어 있음
//여기서 socket은 서버로의 연결 
//frontend에서 backend와 socket으로 연결

const makeMessage=(type,payload)=>{
    const msg={type,payload};
    return JSON.stringify(msg);
}
socket.addEventListener("open",()=>{//connection외 됐을 때
    console.log("connected to Server");
});

socket.addEventListener("message",(message)=>{
  const li = document.createElement("li");
  li.innerText=message.data;
  messageList.append(li);
});

socket.addEventListener("close",()=>{//서버와 연결 끊겼을때
    console.log("Disconnected from Server");
});



messageForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    const input= messageForm.querySelector("input");
    socket.send(makeMessage("new_message",input.value));
   
    const li = document.createElement("li");
    li.innerText=`You : ${input.value}`;//내가 보낸 메시지는 YOu로 
    messageList.append(li);
    input.value="";
});

nickForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname",input.value));//text 대신 json형식으로
    input.value="";
});