
let recognition
let recognizing = false

let player
let videoPlaying = false

// Add videos here
let videoID = ""
// let videoIDs = [""]

// Add phrases here
let phrasesList = ["zelda"]

const btn = document.getElementById("start-stop-btn")
const statusEl = document.getElementById("status")
const playerContainer = document.getElementById("player-container")
const consoleLog = document.getElementById("console-log")

const logToConsole = (audioStr, isInterim = false) => {
    const time = new Date().toLocaleTimeString()

    if (isInterim) {
        if (consoleLog.lastChild && consoleLog.lastChild.classList && consoleLog.lastChild.classList.contains("interim")) {
            consoleLog.lastChild.textContent = `[${time}]: ${audioStr}`
        } else {
            const span = document.createElement("div")
            span.className = "interim"
            span.textContent = `[${time}]: ${audioStr}`
            consoleLog.appendChild(span)
            scrollConsoleLog()
        }
    } else {
        const line = document.createElement("div")
        line.textContent = `[${time}] ${audioStr}`

        if (consoleLog.lastChild && consoleLog.lastChild.classList && consoleLog.lastChild.classList.contains("interim")) {
            consoleLog.removeChild(consoleLog.lastChild)
        }

        consoleLog.appendChild(line)
        scrollConsoleLog()
    }
}

const scrollConsoleLog = () => consoleLog.scrollTop = consoleLog.scrollHeight

const startRecognition = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
        statusEl.textContent = "Your browser does not support the Speech Recognition API"
        btn.disabled = true
        return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onstart = () => {
        recognizing = true
        statusEl.textContent = 'Listening...'
        btn.textContent = "Stop Listening"
        consoleLog.textContent = ""
    }

    recognition.onerror = (event) => {
        console.error("SpeechRecognition error: ", event.error)
        statusEl.textContent = "Error occurred: " + event.error
        logToConsole("Error: " + event.error)
    }

    recognition.onend = () => {
        recognizing = false
        statusEl.textContent = "Stopped listening..."
        btn.textContent = "Begin Listening"
    }

    recognition.onresult = (event) => {
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i]

            if (result.isFinal) {
                const finalText = result[0].transcript.trim()
                let resultArr = finalText.split(" ")
                logToConsole(finalText)

                for (let phrase = 0; phrase < phrasesList.length; phrase++) {
                    for (let r = 0; r < resultArr.length; r++) {
                        // console.log(`Result Found: ${resultArr[r]}`)
                        if (phrasesList[phrase].toLowerCase() == resultArr[r].toLowerCase()) {
                            statusEl.textContent = `[DETECTED]: "${finalText}"`
                            playVideo()
                            // stopRecognition();
                            break
                        } // else {
                          //  statusEl.textContent = `[NOT DETECTED]: "${finalText}"`
                          // }
                    }
                }
            } else {
                interimTranscript += result[0].transcript
            }
        }

        if (interimTranscript) {
            logToConsole(interimTranscript.trim(), true)
        }
    }

    recognition.start()
}

const stopRecognition = () => {
    if (recognition && recognizing) {
        recognition.stop()
    }
}

function onYouTubeIframeAPIReady() {
    // videoFound = videoIDs[Math.floor(Math.random() * 14) + 1]
    // console.log(videoFound)

    player = new YT.Player("player", {
        height: "360",
        width: "640",
        videoId: videoID,
        playerVars: {
            autoplay: 1,
            // controls: 1,
            // modestbranding: 1,
            rel: 0,
        },
        events: {
            onReady: (event) => {},
            onStateChange: () => {}
        }
    })
}

function playVideo() {
    if (!player) {
        statusEl.textContent = "YouTube API is loading, please wait..."
        setTimeout(playVideo, 500)
        return
    }

    if (videoPlaying) return
    videoPlaying = true
    playerContainer.style.display = "block"
    player.playVideo()

    setTimeout(() => {
        stopVideo()
    }, 15000)
}

function stopVideo () {
    if (!videoPlaying) return
    player.pauseVideo()
    videoPlaying = false
    playerContainer.style.display = "none"
    statusEl.textContent = "Video stopped..."
}

btn.addEventListener("click", () => {
    if (recognizing) {
        stopRecognition()
    } else {
        startRecognition()
    }
})
