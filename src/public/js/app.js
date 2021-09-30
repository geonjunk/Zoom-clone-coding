const socket =io();

const welcome =document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden=true;

let roomName;

function addMessage(message){
    const ul=room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText=message;
    ul.appendChild(li);
}
function handleMessageSubmit(event){
    event.preventDefault();
    const input=room.querySelector("#msg input");
    const value=input.value;//안받으면 msg 출력전에 input 비워짐
    socket.emit("new_message",input.value,roomName,()=>{//어디 방에서 보내는지 알아야하므로 arg추가
        addMessage(`you : ${value}`);
    });
    input.value="";
}

function handleNicknameSubmit(event){
    event.preventDefault();
    const input=room.querySelector("#name input");
    const value=input.value;
    socket.emit("nickname",input.value);
}
function showRoom(){
    welcome.hidden=true;
    room.hidden=false;
    const h3=room.querySelector("h3");
    h3.innerText=`Room : ${roomName}`;
    const msgForm = room.querySelector("#msg");
    const nameForm=room.querySelector("#name");
    msgForm.addEventListener("submit",handleMessageSubmit);
    nameForm.addEventListener("submit",handleNicknameSubmit);

}
form.addEventListener("submit",(event)=>{
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room",input.value,showRoom);
    roomName=input.value;
    input.value="";
})

socket.on("welcome",(user,newCount)=>{
    const h3=room.querySelector("h3");
    h3.innerText=`Room ${roomName} ${newCount}`;
    addMessage(`${user} arrived`);
});

socket.on("bye",(left,newCount)=>{
    const h3=room.querySelector("h3");
    h3.innerText=`Room ${roomName} (${newCount})`;
    addMessage(`${left} left ㅠㅠ`);
});
socket.on("new_message",addMessage);

socket.on("room_change",(rooms)=>{
    const roomList=welcome.querySelector("ul");
    if(rooms.length===0){//rooms가 없는 상태로 오면, 즉, room이 하나도 없을때, 모든것을 비워줌
        roomList.innerHTML="";
        return;
    }
    rooms.forEach((room)=>{
        const li=document.createElement("li");
        li.innerText=room;
        roomList.append(li);
    });
});
