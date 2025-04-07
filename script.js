let score = 0;
let attemptedQuestions = [];
let currentTopic = "present-simple"; 

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

    allOptions.forEach(option => {
        if (option.textContent === correctAnswer) {
            option.style.backgroundColor = "lightgreen";
        } else if (option === selectedOption && option.textContent !== correctAnswer) {
            option.style.backgroundColor = "lightcoral";
        }
    });

    if (selectedOption.textContent === correctAnswer) {
        score++;
    }

    disableOptions();
    displayScore();
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

document.getElementById("next-question").onclick = () => fetchQuestion(currentTopic);
