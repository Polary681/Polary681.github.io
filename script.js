let score = 0;
let streak = 0;
let attemptedQuestions = [];
let currentTopic = "present-simple";
let answered = false;
let questionsData = {};
let quizTimer;
let remainingTime = 180; 

async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to load questions.", error);
        return {};
    }
}

loadQuestions().then(data => {
    questionsData = data;
});

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

function startQuiz(topic) {
    currentTopic = topic === 'random' ? getRandomTopic() : topic;
    score = 0;
    streak = 0;
    attemptedQuestions = [];
    document.getElementById("home-page").style.display = "none";
    document.getElementById("quiz-page").style.display = "block";
    document.getElementById("quiz-title").textContent = `English Grammar Quiz - ${currentTopic.replace("-", " ")}`;
    displayScore();
    updateStreak();
    updateProgress();
    fetchQuestion(currentTopic);
    startTimer();
}

function getRandomTopic() {
    const keys = Object.keys(questionsData);
    return keys[Math.floor(Math.random() * keys.length)];
}

function fetchQuestion(topic) {
    const topicQuestions = questionsData[topic];
    const unansweredQuestions = topicQuestions.filter(q => !attemptedQuestions.includes(q.question));

    if (unansweredQuestions.length === 0) {
        alert("All questions for this topic have been attempted.");
        return;
    }

    const randomQuestion = unansweredQuestions[Math.floor(Math.random() * unansweredQuestions.length)];
    attemptedQuestions.push(randomQuestion.question);
    displayQuestion(randomQuestion);
    updateProgress();
}

function displayQuestion(questionData) {
    const questionContainer = document.getElementById("question");
    const optionsContainer = document.getElementById("options");

    const { question, options, answer } = questionData;

    questionContainer.textContent = question;
    optionsContainer.innerHTML = "";
    resetOptions();

    shuffleArray(options).forEach(option => {
        const li = document.createElement("li");
        li.textContent = option;
        li.onclick = () => handleAnswer(li, answer, questionData.tip);
        optionsContainer.appendChild(li);
    });
}

function handleAnswer(selectedOption, correctAnswer, tip) {
    const allOptions = document.querySelectorAll("#options li");
    let isCorrect = selectedOption.textContent === correctAnswer;

    allOptions.forEach(option => {
        if (option.textContent === correctAnswer) {
            option.style.backgroundColor = "lightgreen";
        } else if (option === selectedOption && !isCorrect) {
            option.style.backgroundColor = "lightcoral";
            option.classList.add("shake");
            setTimeout(() => option.classList.remove("shake"), 500);
        }
    });

    if (isCorrect) {
        score++;
        streak++;
        launchConfetti();
        document.getElementById("correct-sound").play();
    } else {
        streak = 0;
        document.getElementById("wrong-sound").play();
        showTip(tip);
    }

    disableOptions();
    displayScore();
    updateStreak();
    answered = true;
}

function showTip(tip) {
    const feedback = document.getElementById("feedback");
    feedback.style.display = "block";
    feedback.textContent = `Tip: ${tip || "Remember the grammar rule!"}`;
}

function disableOptions() {
    document.querySelectorAll("#options li").forEach(option => option.style.pointerEvents = "none");
}

function resetOptions() {
    const feedback = document.getElementById("feedback");
    feedback.style.display = "none";
    feedback.textContent = "";
    document.querySelectorAll("#options li").forEach(option => {
        option.style.backgroundColor = "";
        option.style.pointerEvents = "auto";
    });
}

function displayScore() {
    document.getElementById("score").textContent = "Score: " + score;
}

function updateStreak() {
    document.getElementById("streak").textContent = `🔥 Streak: ${streak}`;
}

function updateProgress() {
    const total = questionsData[currentTopic]?.length || 1;
    const progressPercent = (attemptedQuestions.length / total) * 100;
    document.getElementById("progress-fill").style.width = `${progressPercent}%`;
}

function idk() {
    if (!answered) {
        alert("Please select an answer before moving to the next question.");
        return;
    }
    answered = false;
    fetchQuestion(currentTopic);
}

function shuffleArray(array) {
    return array.map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

function launchConfetti() {
    const confettiCount = 40;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement("div");
        confetti.className = "confetti";
        document.body.appendChild(confetti);

        const startX = window.innerWidth / 2;
        const startY = window.innerHeight - 30;
        const xOffset = Math.random() * 600 - 300;
        const yOffset = Math.random() * -window.innerHeight * 0.9;

        confetti.style.left = `${startX}px`;
        confetti.style.top = `${startY}px`;
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;

        confetti.animate([
            { transform: 'translate(0, 0)', opacity: 1 },
            { transform: `translate(${xOffset}px, ${yOffset}px)`, opacity: 0 }
        ], {
            duration: 1300 + Math.random() * 500,
            easing: 'ease-out',
            fill: 'forwards'
        });

        setTimeout(() => confetti.remove(), 2000);
    }
}

function startTimer() {
    quizTimer = setInterval(() => {
        remainingTime--;
        updateTimerDisplay();

        if (remainingTime <= 0) {
            clearInterval(quizTimer);
            endQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById("timer");
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    timerDisplay.textContent = `Time: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

function endQuiz() {
    alert("The quiz has ended.");
}
