const timerElement = document.getElementById("timer");
let timeLeft = 55 * 60 + 30; // 55 minutes, 30 seconds

function updateTimer() {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const seconds = String(timeLeft % 60).padStart(2, "0");

    timerElement.textContent = `ENDS IN 00:${minutes}:${seconds}`;

    if (timeLeft > 0) {
        timeLeft--;
    } else {
        clearInterval(timerInterval);
        timerElement.textContent = "Deal Ended";
    }
}

const timerInterval = setInterval(updateTimer, 1000);
