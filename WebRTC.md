# video call
* 먼저 유저로부터 비디오를 가져와 화면에 비디오를 보여줘야 함
* 마이크 음소거/ 카메라 on off 버튼 추가
* JS를 사용해 유저 컴퓨터의 카메라 list를 얻을 수 있음
* getUserMedia(constraint)로 많은 것 줄 수 있음
    * ex) 휴대폰 시 셀카로 연다 등
    * 공식 문서 참고
* video 생성 
    * playsinline : 모바일 브라우저가 필요로 하는 속성, 재생시 웹사이트 내에서만 실행되게
* Stream : 비디오 + 오디오의 결합
    * track 이라는 것을 제공해줌
        * 비디오, 오디오 , 자막 등이 하나의 트랙이됨 
        * 코드를 통해 track에 접근할 수 있음
            * getVideoTracks() 등
        * enumerateDevices를 통해 연결된 모든 장치정보얻을 수 있음

* 카메라 변경법
    * id를 통해 강제로 다시 시작하여 변경
    * deviceId를 getMedia의 인자로 받음
    * video:{deviceId: deviceId} : 해당 비디오로 실행하는데 찾지못하면 다른것으로 실행
    * video:{deviceId:{exact:deviceId}} : 해당 카메라로만 실행

## WebRTC API (Web RealTime Communication)
* 브라우저에서 실행할 때 JS API통해 쉽게 실행 가능함
* 실시간 커뮤니케이션을 가능하게 해주는 기술
* socket io 방식은 chat는 한서버에 많은 websocket이 연결된 방식
    * 즉, 서버로 통해 다른 곳에 메시지 전달
* webRTC는 peer to peer 방식이용
    * 내 오디오와 텍스트가 서버로 가지않음
    * 직접 다른 사람한테 바로감 -> 속도가 빨라짐
        * 서버에 모든 영상, 텍스트 올리는 비용 아낄 수있음
    * 즉, 내 브라우저가 다른 브라우저와 직접 연결된 것
* 서버가 필요하긴하지만 오디오나 텍스트 전달 목적이 아닌 signaling의 목적으로 필요
    * 다른 브라우저의 IP주소, 방화벽 여부,오픈 port 등 처음에 어디있는지에 대한 정보를 알려주기 위해 서버 이용
    * 즉, 서버는 브라우저에게 configuration만 전달함

* webrtc를 할때 따라야할 프로세스가 있음
    * ex) room이 존재하며, 누군가 들어왔을 때 알림 날림

## webRtc의 프로세스 따르기
1. getUserMedia를 통해 media 정보 받아옴
2. 양쪽 브라우저에 연결통로를 만들어 연결 진행할거임
    * 양쪽 브라우저끼리의 peerkConnection을 생성함
3. stream에 데이터를 가져다가 연결에 집어넣음
    * stream데이터를 peer conncection에 넣어야함
* 한쪽에 peer에서 offer보내고 다른쪽에서는 answer보냄, 우선 offer 생성
    * ex) 예제에서는 처음부터 들어가있던 브라우저가 peer A 고 들어온 브라우저가 peer B (A가 offer를 만들고 B는 answer생성)
4. 방금 만든 offer로 연결을 구성
5. 이제 offer를 보냄
6. 반대쪽에서 받은 offer 확인
* 이렇게 offer를 주고 받을때는 서버가 필요함
7. setRemoteDescription
    * peer A 가 받은 description은 local 
    * peer B가 offer를 통해 받은 description 즉, 다른 사람이 받은 description은 remoteDescription
    * media를 가져오는 속도나 연결을 만드는 속도보다 socket io 가 매우 빠르기때문에 getMedia와 makeConnection을 한 후 이벤트를 emit하는 것으로 수정
8. answer 생성
9. answer도 똑같이 보내고 반대쪽에 setRemoteDescription 진행
10. icecandidate event 등록
    * offer와 answer를 가지고 그걸 받는걸 모두 끝냈을 때, peer to peer 양쪽에서 icecandidate 이벤트 실행
    * Internet connectivity Establishment(인터넷 연결 생성)
    * webRTC에 필요한 프로토콜로 브라우저가 서로 소통할 수 있게하는 방법을 중재하는 역할
    * 다수의 candidate(후보)들이 각각의 연결에서 제안되고, 그리고 그들은 서로의 동의 하에 하나에 방법을 선택하여 소통방식에 사용함
    * candidate들은 다른 브라우저로 전송을 해줘야하며 서로 주고 받아야함
11. addstream event 등록

## 카메라 바꼈을 때
* sender
    * peer로 보내진 media stream track을 컨트롤하게 함
* sender를 통해 user한테 보내는 track도 바꿔줘야 함
* sender중 video를 가진 sender를 이용

## 폰에서도 돌아가게 하는 법
* localtunnel 설치
    * 서버를 전세계와 공유하게 해줌
    * 일시적으로만 무료로 서버의 URL 생성해줌
* 폰과 컴퓨터가 같은 인터넷(와이파이) 쓰면 오류 없음

## STUN 서버
* 폰과 컴퓨터가 다른 인터넷 사용하는 경우 필요한 서버
* 컴퓨터가 공용 IP주소를 찾게 해준다
* peer to peer 연결을 해야하기때문에 서로를 찾아야만 하기때문에 필요
* STUN 서버는 어떤 것을 request하면 인터넷에서 네가 누군지를 알려주는 서버
    * 즉, 서버가 나의 공용 IP를 알려줌
* 전문적으로 하려면 STUN서버 따로 만들어야함(애플리케이션 만들때)
* 여기서는 구글이 만든 서버로 이용(테스트 용)
* 비디오를 보내기위해 stun서버가 있는게 아니라 공용ip를 찾기위해 stun 서버가 존재하는것

## DATA Channel
* peer to peer 유저들이 모든 종류의 데이터를 주고 받을 수 있는 채널
* 비디오, 오디오뿐만 아니라 이미지, 파일, 텍스트 등 주고 받을 수있음
* socket io나 ws 없이 채팅도 만들 수 있음
* peer to peer 게임도 만들 수 있음

## WebRTC의 안좋은점
* 많은 peer가 있을 때 느려지기 시작함
    * 여러 peer 면 하나의 stream을 여러번 보내는 작업이나 받는 작업을 반복해야함
    * 한 3명까지가 적당함
    * SFU를 이용해 해결해
        * 서버에 의존하여 여러번 업로드하는 과정을 해결하며 다운로드할때도 그 스트림을 서버가 압축해서 전달함
        * 누가 이방의 호스트인지 누가 발표하고 있는지 등을 고려하여 스트림을 압축
        * 상황에 따라 저사양에 스트림을 제공받음
* 하지만 data channel을 고민하지 않아도 됨
    * 텍스트 보낼때는 업로드와 다운로드가 매우 빠름
    * 비디오나 오디오를 다운로드할때 문제가 발생