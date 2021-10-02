const socket =io();

const myFace=document.getElementById("myFace");
const muteBtn=document.getElementById("mute");
const cameraBtn=document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");


const call = document.getElementById("call");

call.hidden = true;

let myStream;//stream을 받음
let muted=false;//음소거 여부 추적할 변수
let cameraOff=false;//카메라여부 추적할 변수도 필요
let roomName;
let myPeerConnection;//연결을 모든 함수에서 공유하기 위해 변수 받음


async function getCameras(){
    try{
        const devices=await navigator.mediaDevices.enumerateDevices();
        const cameras=devices.filter(device=>device.kind==="videoinput");
        const currentCamera=myStream.getVideoTracks()[0];//현재 선택된 카메라
        cameras.forEach(camera => {
            const option=document.createElement("option");
            option.value=camera.deviceId;
            option.innerText=camera.label;
            if(currentCamera.label===camera.label){//현재 선택
                option.selected=true;
            }
            camerasSelect.appendChild(option);
        });
    }catch(e){
        console.log(e);
    }
}

async function getMedia(deviceId){
    const initialConstraints={
        audio:true,
        video:{facingMode:"user"}
    };
    const camerasConstraint={
        audio:true,
        video: { deviceId: { exact: deviceId } },
    };
    try{
        myStream=await navigator.mediaDevices.getUserMedia(//유저의 유저미디어의 string을 줌
            deviceId?camerasConstraint:initialConstraints
        );
        myFace.srcObject=myStream;
        if(!deviceId){//최초실행때만 카메라 목록 가져옴
            await getCameras();
        }
    }catch(e){
        console.log(e);
    }
}


const handleMuteClick=()=>{
    myStream.getAudioTracks().forEach((track) => (track.enabled=!track.enabled));
    console.log(myStream.getAudioTracks());
    if(!muted){
        muteBtn.innerText="Unmute";
        muted=true;
    }else{
        muteBtn.innerText="Mute";
        muted=false;
    }
};

const handleCameraClick=()=>{
    myStream.getVideoTracks().forEach((track) => (track.enabled=!track.enabled));
    console.log(myStream.getVideoTracks());
    if(cameraOff){
        cameraBtn.innerText="Turn camera off";
        cameraOff=false;
    }else{
        cameraBtn.innerText="Turn camera On";
        cameraOff=true;
    }
};

const handleCameraChange= async ()=>{
   await getMedia(camerasSelect.value);
};
muteBtn.addEventListener("click",handleMuteClick);
cameraBtn.addEventListener("click",handleCameraClick);
camerasSelect.addEventListener("input",handleCameraChange);//input에 카메라 선택 바꼈을 때


//welcomeForm -> join a room
const welcome=document.getElementById("welcome");
const welcomeForm=welcome.querySelector("form");

const initCall=async()=>{//우리 media를 가져가서 연결을 만들어주는 함수
    welcome.hidden=true;
    call.hidden=false;
    await getMedia();
    makeConnection();
}
const handleWelcomeSubmit=async (event) =>{
    event.preventDefault();
    const input = welcomeForm.querySelector("input");
    await initCall();//방에 참가하고 나서 호출대신 참가 전에 호출로 변경
    socket.emit("join_room", input.value);
    roomName = input.value;//방에 참가했을 때 나중에 쓸 수 있기위해 roomName 저장
    input.value = "";
  };
  
welcomeForm.addEventListener("submit",handleWelcomeSubmit);


//socket code
socket.on("welcome",async ()=>{
    const offer=await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer);//offer로 연결 구성
    console.log("sent the offer");
    socket.emit("offer",offer,roomName)//어떤 방이 offer emit 할건지, 즉, 누구한테 이 offer 보낼지를 넣어 보내야하기때문에 방이름을 같이 보냄
    //offer를 보내는쪽에서 발생
});//누군가 우리방에 들어왔을 때
socket.on("answer",(answer)=>{
    console.log("received the answer");
    myPeerConnection.setRemoteDescription(answer);
});


socket.on("offer",async(offer)=>{
    console.log("received the offer");
    myPeerConnection.setRemoteDescription(offer);//offer를 받아 remoteDescription 설정
    const answer = await myPeerConnection.createAnswer();
    myPeerConnection.setLocalDescription(answer);
    socket.emit("answer",answer,roomName);
    console.log("sent the answer")
})//offer를 받는 쪽에서 발생
//RTC Code
const makeConnection=()=>{
    myPeerConnection = new RTCPeerConnection();
    myPeerConnection.addEventListener("icecandidate",handleIce);
    myStream
      .getTracks()
      .forEach((track) => myPeerConnection.addTrack(track, myStream));//양쪽 브라우저에서 카메라와 마이크의 데이터 stream을 받아서 그것들을 connection 안에 집어넣음
};

const handleIce=(data)=>{
    console.log("got ice candidate");
    console.log(data);
}