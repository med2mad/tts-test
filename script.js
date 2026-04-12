const textarea = document.querySelector("textarea"),
    voiceList = document.querySelector("select"),
    speechBtn = document.querySelector("#speechButton");
downloadBtn = document.querySelector("#DownloadButton");
modalContent = document.querySelector(".modal-content");
modalText = document.querySelector("#modalText");
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

let synth = speechSynthesis,
    isSpeaking = true;

voices();

function voices() {
    alert(synth.getVoices().length);
    for (let voice of synth.getVoices()) {
        let selected = voice.name === "Google US English" ? "selected" : "";
        let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
        voiceList.insertAdjacentHTML("beforeend", option);
        alert(voice.name);
    }
}

synth.addEventListener("voiceschanged", voices);

function textToSpeech(text) {
    let utterance = new SpeechSynthesisUtterance(text);
    for (let voice of synth.getVoices()) {
        if (voice.name === voiceList.value) {
            utterance.voice = voice;
        }
    }
    synth.speak(utterance);
}

speechBtn.addEventListener("click", e => {
    e.preventDefault();
    if (textarea.value !== "") {
        if (!synth.speaking) {
            textToSpeech(textarea.value);
        }
        if (textarea.value.length > 5) {
            setInterval(() => {
                if (!synth.speaking && !isSpeaking) {
                    isSpeaking = true;
                    speechBtn.innerHTML = `Convert To Speech &nbsp;<i class="fa-solid fa-headphones"></i></box-icon>`;
                } else {
                }
            }, 500);
            if (isSpeaking) {
                synth.resume();
                isSpeaking = false;
                speechBtn.innerHTML = `Pause Speech &nbsp;<i class="fa-solid fa-pause"></i></box-icon>`;
            } else {
                synth.pause();
                isSpeaking = true;
                // speechBtn.innerText = "Resume Speech";
                speechBtn.innerHTML = `Resume Speech &nbsp;<i class="fa-solid fa-play"></i></box-icon>`;

            }
        } else {
            speechBtn.innerHTML = `Convert To Speech &nbsp;<i class="fa-solid fa-headphones"></i></box-icon>`;
        }
    } else {
        modal.style.display = "block";
        modalText.innerHTML = `Please Enter a Text`;
    }
});


// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

