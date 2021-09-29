# Socket IO (공식문서 참고)
* 쉽게 실시간 기능을 만들어주는 framework ->Socket IO 매우 안정적
* SocketIO는 프론트와 백엔드간 실시간 통신을 가능하게 해주는 프레임워크 또는 라이브러리임
    * 매우 쉬운 코드 제공
    * 신뢰성 제공의 장점(모든 플랫폼, 모든 디바이스에서 사용 가능)
    * websocket보다는 조금 무거움
* 실시간, 양방향, event기반의 통신을 가능하게 함
* websocket보다 탄력성 뛰어남
* websocket은 socket IO가 실시간, 양방향, event 기반 통신을 제공하는 방법 중 하나, 즉, 많은 방법 중 하나
* Socket IO는 websocket의 부가기능이 아님
* proxy, firewall 등 (websocket 연결을) 막는 것이 있어도 계속 작동 함
* 즉,websocket을 사용하지만 websocket을 지원하지 않으면 HTTP long polling 등 다른 방법을 사용함 
* Wifi가 끊기는 것 과 같이 연결 끊긴 경우 재연결 시도함
* 즉, 연결의 신뢰성 보장함

* 브라우저가 주는 websocket은 socket IO와 호환이 안되므로, 브라우저(front)에도 socket io 설치해야함
* script(src="/socket.io/socket.io.js") 를 통해 설치 해줘야 함
* front end와 backend를 연결하려면 io function 이용
    * 자동적으로 backend socketio와 연결
* console로 socket 출력시 websocket이 아닌 socketio에 socket으로 나옴
* 지금연결된 socket들을 자동적으로 추적하고 있음
* 서버끊겨도 연결 재시도 함

* socket.emit의 개선점
    * 어떤 event든 전송가능
    * JS object를 string으로 바꾸지 않고 전송 가능(전에는 string으로만 가능)
    * 여러개도 보낼 수 있음
    * 세번째 인자에는 서버에서 호출하는 callback function 넣을 수 있음(이 fucntion은 front에 존재)
    * done을 통해 callback function을 front에서 실행하게함
        * 서버에서 호출하지만 front-end에서 실행됨
        * front-end에 작업완료했다 전달할때 사용됨
    * 그 function을 통해 backend에서 argument전달도 가능
## room 개념 (socket 그룹)
* SocketIO에서는 room 개념 존재
    * 방을 만들거나 방을 참가하는 form을 제공
    * 방에 메시지 보내는 것도 가능
* socket.onAny(callback) : 미들웨어 같은거, 어떤 event든 console.log할 수 있게 응용가능
* socket.join("룸이름") 하면 생성됨, 여러방에 동시에 들어가는 것도 가능
* socket.leave(room)을 통해 나갈 수 있음
* 기본적으로 room 하나에 들어가 있음 : user의 socket id와 처음 들어가 있는 room에 id와 동일 함
* socket.to(room)을 통해 방전체에 메시지 보낼 수있음
    * 다른 socket의 id를 알고있다면 개인에게도 보낼 수 있음