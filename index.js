/* firebase 인증 */
firebase.initializeApp({
    apiKey: "AIzaSyDWjUAC-8Wk9ZajKutcqkOZ-AerIlWsQ3g",
    authDomain: "video-webrtc.firebaseapp.com",
    databaseURL: "https://video-webrtc.firebaseio.com",
    projectId: "video-webrtc",
    storageBucket: "video-webrtc.appspot.com",
    messagingSenderId: "863612026529"
});

var 
    database = firebase.database().ref(),
    pc = new window.webkitRTCPeerConnection({ // https://developer.mozilla.org/ko/docs/Web/API/RTCPeerConnection
        'iceServers': [
            {'url': 'stun:stun.l.google.com:19302'} 
        ]
    });

console.log(database);
console.log(pc);