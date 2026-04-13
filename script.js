const textarea = document.querySelector("textarea"),
    voiceList = document.querySelector("select"),
    speechBtn = document.querySelector("#speechButton");
textarea.value = "你好";
let synth = speechSynthesis,
    isSpeaking = true;

voices();

function voices() {
    let availableVoices = synth.getVoices();
    if (availableVoices.length === 0) return;
    voiceList.innerHTML = "";
    let firstZhVoice = true;
    for (let voice of availableVoices) {
        if (voice.lang.toLowerCase().includes("zh")) {
            let isCn = voice.lang.includes("CN");
            let selected = (firstZhVoice || isCn) ? "selected" : "";
            if (isCn) firstZhVoice = false; // prioritize CN if found
            let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
            voiceList.insertAdjacentHTML("beforeend", option);
            if (firstZhVoice) firstZhVoice = false;
        }
    }
}

if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = voices;
}

// Fallback for some mobile browsers
setTimeout(voices, 100);
setTimeout(voices, 500);
setTimeout(voices, 1000);

function textToSpeech(text) {
    let utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN"; // Explicitly force Chinese (zh-CN)
    let selectedVoiceName = voiceList.value;
    let fallbackVoice = null;

    for (let voice of synth.getVoices()) {
        if (voice.name === selectedVoiceName) {
            utterance.voice = voice;
        }
        if (!fallbackVoice && voice.lang.toLowerCase().includes("zh")) {
            fallbackVoice = voice;
        }
    }

    // If selected voice fails or is empty, use the first available Chinese voice
    if (!utterance.voice && fallbackVoice) {
        utterance.voice = fallbackVoice;
    }

    synth.speak(utterance);
}

speechBtn.addEventListener("click", e => {
    e.preventDefault();
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
});
