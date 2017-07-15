/* firebase 인증 */
firebase.initializeApp({
    apiKey: "AIzaSyDWjUAC-8Wk9ZajKutcqkOZ-AerIlWsQ3g",
    authDomain: "video-webrtc.firebaseapp.com",
    databaseURL: "https://video-webrtc.firebaseio.com",
    projectId: "video-webrtc",
    storageBucket: "video-webrtc.appspot.com",
    messagingSenderId: "863612026529"
});




/*  RTCPeerConnection
    https://developer.mozilla.org/ko/docs/Web/API/RTCPeerConnection
*/
var pc = new window.webkitRTCPeerConnection({  
        'iceServers': [
            {'url': 'stun:stun.l.google.com:19302'} 
        ]
    });




// 시그널링을 위한 firebase 디비 등록
var database = firebase.database().ref(),
    userId   = 'user'+new Date().getTime(),
    your     = document.getElementById('your'), // 내 화면
    user     = document.getElementById('user'); // peer 화면
    




/* 카메라 엑세스 메서드 주입 */
navigator.getMedia = ( 
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia
);

/* 엑세스 되었을 시 콜백 호출 */
navigator.getMedia({audio:true, video:true}, function(e){ // success
    your.srcObject = e; // #your 비디오 태그 소스 주입
    your.play();

    // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addStream
    pc.addStream(e);

}, function(e){ console.log('err ', e); });






 /* firebase DB에 노드가 추가가 되면 콜백 호출 */
database.on('child_added', read);



/*  신호 콜백

    시그널링 프로세스 진행
*/
function read(e){
    var message = JSON.parse(e.val().message),
        sender  = e.val().sender;

    if(sender !== userId){ // 동일하지 않다면

        if(message.ice != undefined) pc.addIceCandidate(new RTCIceCandidate(message.ice))
        else{
            switch(message.sdp.type){
                case 'offer' : /* offer내 세션정보를 커넥션을 원하는 유저에게 전달 */

                    pc.setRemoteDescription(new RTCSessionDescription(message.sdp))
                    .then(() => pc.createAnswer()) /* answer 생성 */
                    .then(answer => pc.setLocalDescription(answer))
                    .then(() => send(userId, JSON.stringify({'sdp': pc.localDescription})));
                    
                    break;
                case 'answer' :

                    pc.setRemoteDescription(new RTCSessionDescription(message.sdp));
                    
                    break;
                default : break;
            }
        }
             
    }

}





/* 시그널링 처리를 위한 신호 전송
*/
function send(senderId, data){
    var message = database.push({
        sender : senderId,
        message : data
    });

    message.remove();

}



/*  연결
    https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer

    call을 시작하는 유저가 offer 생성
    이 offer는 세션정보를 sdp 포맷으로 가지고 있음.

*/
function show(){
    
    pc.createOffer() 
    .then(function(offer){
        pc.setLocalDescription(offer);
    })
    .then(function(){
        send(userId, JSON.stringify({
            'sdp': pc.localDescription
        }));
    });
}







/*  신호 정보를 받았을 시 콜백 호출 이를 원격 peer에 전달 */
pc.onicecandidate = function(e){
    if(e.candidate) send(userId, JSON.stringify( {'ice': e.candidate} ));

};




/*  원격 peer에 스트림이 연결될 때 발생 */ 
pc.onaddstream = function(e){
    user.srcObject = e.stream;
    user.play();

    console.log('on stream');
};
