let score = 0;
let attemptedQuestions = [];
let currentTopic = "present-simple"; 
let answered = false;

async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        const data = await response.json();
        return data;
    } catch (error) {
        return {};
    }
}

let questionsData = {};  

loadQuestions().then(data => {
    questionsData = data;
});


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
    changeStatus()
}

function displayQuestion(questionData) {
    const questionContainer = document.getElementById("question");
    const optionsContainer = document.getElementById("options");

    const { question, options, answer } = questionData;

    questionContainer.textContent = question;
    optionsContainer.innerHTML = "";
    resetOptions();

    options.forEach(option => {
        const li = document.createElement("li");
        li.textContent = option;
        li.onclick = () => handleAnswer(li, answer);
        optionsContainer.appendChild(li);
    });
}

function handleAnswer(selectedOption, correctAnswer) {
    const allOptions = document.querySelectorAll("#options li");

    let isCorrect = selectedOption.textContent === correctAnswer;

    allOptions.forEach(option => {
        if (option.textContent === correctAnswer) {
            option.style.backgroundColor = "lightgreen";
        } else if (option === selectedOption && !isCorrect) {
            option.style.backgroundColor = "lightcoral";
            option.classList.add("shake");
            setTimeout(() => {
                option.classList.remove("shake");
            }, 500);
        }
    });

    if (isCorrect) {
        score++;
        launchConfetti();
        document.getElementById("correct-sound").play(); 
    } 
    else{
        document.getElementById("wrong-sound").play();
    }

    disableOptions();
    displayScore();
    answered = true;
}

function disableOptions() {
    document.querySelectorAll("#options li").forEach(option => {
        option.style.pointerEvents = "none";
    });
}

function resetOptions() {
    document.querySelectorAll("#options li").forEach(option => {
        option.style.backgroundColor = "";
        option.style.pointerEvents = "auto";
    });
}

function displayScore() {
    document.getElementById("score").textContent = "Score: " + score;
}

function startQuiz(topic) {
    currentTopic = topic;
    score = 0; 
    attemptedQuestions = []; 
    document.getElementById("home-page").style.display = "none";
    document.getElementById("quiz-page").style.display = "block";
    document.getElementById("quiz-title").textContent = `English Grammar Quiz - ${topic.replace("-", " ")}`;
    displayScore(); 
    fetchQuestion(topic);
}


function idk() {
    if (!answered) {
        alert("Please select an answer before moving to the next question.");
        return;
    }

    answered = false; 
    fetchQuestion(currentTopic);
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

        setTimeout(() => {
            confetti.remove();
        }, 2000);
    }
}


