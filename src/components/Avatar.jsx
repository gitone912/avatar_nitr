import "./Avatar.css";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import { createAvatarSynthesizer, createWebRTCConnection } from "./Utility";
import { avatarAppConfig } from "./config";
import { useState } from "react";
import { useRef } from "react";

export const Avatar = () => {
    
    const [avatarSynthesizer, setAvatarSynthesizer] = useState(null);
    const myAvatarVideoEleRef = useRef();
    const myAvatarAudioEleRef = useRef();
    const [mySpeechText, setMySpeechText] = useState("");
    const [transcription, setTranscription] = useState(null);
    
    var iceUrl = avatarAppConfig.iceUrl
    var iceUsername = avatarAppConfig.iceUsername
    var iceCredential = avatarAppConfig.iceCredential

    // const handleSpeechText = (event) => {
    //     setMySpeechText(event.target.value);
    // }


    const handleOnTrack = (event) => {

        console.log("#### Printing handle onTrack ",event);
    
        // Update UI elements
        console.log("Printing event.track.kind ",event.track.kind);
        if (event.track.kind === 'video') {
            const mediaPlayer = myAvatarVideoEleRef.current;
            mediaPlayer.id = event.track.kind;
            mediaPlayer.srcObject = event.streams[0];
            mediaPlayer.autoplay = true;
            mediaPlayer.playsInline = true;
            mediaPlayer.addEventListener('play', () => {
            window.requestAnimationFrame(()=>{});
          });
        } else {
          // Mute the audio player to make sure it can auto play, will unmute it when speaking
          // Refer to https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide
          //const mediaPlayer = myAvatarVideoEleRef.current;
          const audioPlayer = myAvatarAudioEleRef.current;
          audioPlayer.srcObject = event.streams[0];
          audioPlayer.autoplay = true;
          audioPlayer.playsInline = true;
          audioPlayer.muted = true;
        }
      };

    const stopSpeaking = () => {
        avatarSynthesizer.stopSpeakingAsync().then(() => {
          console.log("[" + (new Date()).toISOString() + "] Stop speaking request sent.")
    
        }).catch();
    }  

    const stopSession = () => {

        try{
          //Stop speaking
          avatarSynthesizer.stopSpeakingAsync().then(() => {
            console.log("[" + (new Date()).toISOString() + "] Stop speaking request sent.")
            // Close the synthesizer
            avatarSynthesizer.close();
          }).catch();
        }catch(e) {
        }
      }

      const speakSelectedText = async () => {
        try {
          // Fetch transcription data
          const response = await fetch('http://127.0.0.1:8000/transcribe/');
          const data = await response.json();
      
          if (data.status === 'success') {
            // Set the transcription in the state
            setTranscription(data.transcription);
      
            // Continue with speaking
            const audioPlayer = myAvatarAudioEleRef.current;
            console.log("Audio muted status ", audioPlayer.muted);
            audioPlayer.muted = false;
      
            // Use the awaited transcription
            await avatarSynthesizer.speakTextAsync(data.transcription);
      
            console.log("Speech and avatar synthesized to video stream.");
          } else {
            // Handle the error case
            console.error(data.message);
          }
        } catch (error) {
          console.error('Error fetching transcription:', error);
        }
      };

    const startSession = () => {

        let peerConnection = createWebRTCConnection(iceUrl,iceUsername, iceCredential);
        console.log("Peer connection ",peerConnection);
        peerConnection.ontrack = handleOnTrack;
        peerConnection.addTransceiver('video', { direction: 'sendrecv' })
        peerConnection.addTransceiver('audio', { direction: 'sendrecv' })
        
        let avatarSynthesizer = createAvatarSynthesizer();
        setAvatarSynthesizer(avatarSynthesizer);
        peerConnection.oniceconnectionstatechange = e => {
            console.log("WebRTC status: " + peerConnection.iceConnectionState)
    
            if (peerConnection.iceConnectionState === 'connected') {
                console.log("Connected to Azure Avatar service");
            }
    
            if (peerConnection.iceConnectionState === 'disconnected' || peerConnection.iceConnectionState === 'failed') {
                console.log("Azure Avatar service Disconnected");
            }
        }
    
        avatarSynthesizer.startAvatarAsync(peerConnection).then((r) => {
            console.log("[" + (new Date()).toISOString() + "] Avatar started.")
    
        }).catch(
            (error) => {
                console.log("[" + (new Date()).toISOString() + "] Avatar failed to start. Error: " + error)
            }
        );
    }

        



    return(
        // <div className="container myAvatarContainer">
        //     <p className="myAvatarDemoText">Azure Avatar Demo</p>
        //     <div className="container myAvatarVideoRootDiv d-flex justify-content-around">
        //         <div  className="myAvatarVideo">
        //             <div id="myAvatarVideo" className="myVideoDiv">
                        
        //                 <video className="myAvatarVideoElement" ref={myAvatarVideoEleRef}>

        //                 </video>

        //                 <audio ref={myAvatarAudioEleRef}>

        //                 </audio>
        //             </div>
        //             <div className="myButtonGroup d-flex justify-content-around">
        //                 <button className="btn btn-success"
        //                     onClick={startSession}>
        //                     Connect
        //                 </button>
        //                 <button className="btn btn-danger"
        //                     onClick={stopSession}>
        //                     Disconnect
        //                 </button>
        //             </div>
        //         </div>
        //         <div className="myTextArea">
                    
        //             {/* <textarea className="myTextArea" onChange={handleSpeechText}>

        //             </textarea> */}
        //             <div className="myButtonGroup d-flex justify-content-around">
        //                 <button className="btn btn-success" onClick={speakSelectedText}>
        //                     Speak
        //                 </button>
        //                 <button className="btn btn-warning" onClick={stopSpeaking}>
        //                     Stop
        //                 </button>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <div className="my-avatar-container">
      <p className="my-avatar-demo-text">MINMIN</p>
      <div className="my-avatar-video-root-div d-flex justify-content-around">
        <div className="my-avatar-video">
          <div id="my-avatar-video" className="my-video-div">
            <video className="my-avatar-video-element" ref={myAvatarVideoEleRef}></video>
            <audio ref={myAvatarAudioEleRef}></audio>
          </div>
          <div className="my-button-group d-flex justify-content-around">
            <button className="btn btn-success" onClick={startSession}>
              Connect
            </button>
            <button className="btn btn-danger" onClick={stopSession}>
              Disconnect
            </button>
          </div>
        </div>
        <div className="my-text-area">
          <div className="my-button-group d-flex justify-content-around">
            <button className="btn btn-success" onClick={speakSelectedText}>
              Speak
            </button>
            <button className="btn btn-warning" onClick={stopSpeaking}>
              Stop
            </button>
          </div>
        </div>
      </div>
</div>

    );
};