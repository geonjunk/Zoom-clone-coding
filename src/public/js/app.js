const socket =new WebSocket(`ws://${window.location.host}`);
//프론트에선 브라우저에 대한 ws 가 implementation이 되어 있음
//여기서 socket은 서버로의 연결 
//frontend에서 backend와 socket으로 연결