/* firebase 인증 */
firebase.initializeApp({
    apiKey: "AIzaSyDWjUAC-8Wk9ZajKutcqkOZ-AerIlWsQ3g",
    authDomain: "video-webrtc.firebaseapp.com",
    databaseURL: "https://video-webrtc.firebaseio.com",
    projectId: "video-webrtc",
    storageBucket: "video-webrtc.appspot.com",
    messagingSenderId: "863612026529"
});

var database = firebase.database().ref(),
    pc = new window.webkitRTCPeerConnection({ // https://developer.mozilla.org/ko/docs/Web/API/RTCPeerConnection
        'iceServers': [
            {'url': 'stun:stun.l.google.com:19302'} 
        ]
    });



var userId = 'user'+new Date().getTime(),
    your = document.getElementById('your'),
    user = document.getElementById('user');




/* 카메라 엑세스 */
navigator.getMedia = ( 
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia
);

navigator.getMedia({audio:true, video:true}, function(e){
    your.src = window.URL.createObjectURL(e);
    your.play();

}, function(e){
    console.log('err ', e);

});





database.on('child_added', read);




function read(e){
    var message = e.val().message,
        sender  = e.val().sender;

    console.log(message, sender);

}




function send(senderId, data){
    var msg = database.push({
        sender : senderId,
        message : data
    });

    msg.remove();

}


