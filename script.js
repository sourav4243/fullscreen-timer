
let timerElement = document.getElementById('timer');
let workTime = 1200;  // 20 minutes default
let breakTime = 300;  // 5 minutes default
let smallTimerCycle = 600;  // 10-minute cycle for the pie chart
let interval;
let pieInterval;
let isRunning = false;
let seconds = workTime;  // Start with the 50-minute timer
let pieSeconds = smallTimerCycle;  // Start with 10-minute pie chart timer
let isWorkPhase = true;

// Pie chart element
const pie = document.querySelector('.pie');
const workInput = document.getElementById('workInput');
const breakInput = document.getElementById('breakInput');
const startPauseBtn = document.getElementById('startPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const applyBtn = document.getElementById('applyBtn');

function updateTimerDisplay() {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;

    timerElement.textContent =
        String(minutes).padStart(2, '0') + ":" +
        String(remainingSeconds).padStart(2, '0');

    // Visual cue for last 1 minute of the 10-minute break timer
    if (!isWorkPhase && seconds <= 60) {
        timerElement.style.color = `rgb(${255 - seconds * 4}, ${seconds * 4}, 0)`;  // Gradually change from red to green
    } else {
        timerElement.style.color = "white";
    }
}

function startTimer() {
    if (interval) clearInterval(interval);
    if (pieInterval) clearInterval(pieInterval);
    interval = setInterval(() => {
        if (seconds > 0) {
            seconds--;
            updateTimerDisplay();
        } else {
            clearInterval(interval);
            if (isWorkPhase) {
                startBreakTimer();
            } else {
                restartWorkTimer();
            }
        }
    }, 1000);
    pieInterval = setInterval(updatePieTimer, 1000);
    isRunning = true;
    startPauseBtn.textContent = 'Pause';
}

function pauseTimer() {
    clearInterval(interval);
    clearInterval(pieInterval);
    isRunning = false;
    startPauseBtn.textContent = 'Start';
}

function resetTimer() {
    pauseTimer();
    isWorkPhase = true;
    seconds = workTime;
    pieSeconds = smallTimerCycle;
    updateTimerDisplay();
    pie.style.background = `conic-gradient(white 0% 0deg, black 0deg 360deg)`;
}

function updatePieTimer() {
    if (pieSeconds > 0) {
        pieSeconds--;

        let percentComplete = (smallTimerCycle - pieSeconds) / smallTimerCycle;
        let rotationDegree = percentComplete * 360;

        // Use conic-gradient to create the wiping effect
        pie.style.background = `conic-gradient(white 0% ${rotationDegree}deg, black ${rotationDegree}deg 360deg)`;
    } else {
        pieSeconds = smallTimerCycle;  // Reset the pie timer every 10 minutes
    }
}

function startBreakTimer() {
    isWorkPhase = false;
    seconds = breakTime;
    pieSeconds = smallTimerCycle;  // Reset pie chart for break
    updateTimerDisplay();
    startTimer();
}

function restartWorkTimer() {
    isWorkPhase = true;
    seconds = workTime;
    pieSeconds = smallTimerCycle;  // Reset pie chart for work cycle
    updateTimerDisplay();
    startTimer();
}

function toggleTimer() {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}

startPauseBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);
applyBtn.addEventListener('click', function() {
    let w = parseInt(workInput.value, 10);
    let b = parseInt(breakInput.value, 10);
    if (isNaN(w) || w < 1) w = 1;
    if (isNaN(b) || b < 1) b = 1;
    workTime = w * 60;
    breakTime = b * 60;
    smallTimerCycle = 600; // always 10 min for pie
    resetTimer();
});

// Fullscreen mode activation and toggle timer on spacebar press
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && event.target.tagName !== 'INPUT') {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting fullscreen: ${err.message}`);
            });
        }
        toggleTimer();
    }
});

// Initial timer display setup
updateTimerDisplay();
