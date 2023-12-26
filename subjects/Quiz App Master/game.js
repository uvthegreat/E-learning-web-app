const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];

let questions = [];

const data = {
  COA: {
    results: [
      {
        question: "Who developed the basic architecture of computer?",
        correct_answer: "John Von Neumann",
        incorrect_answers: [
          "Blaise Pascal",
          "Charles Babbage",
          "None of the above",
        ],
      },
      {
        question:
          "Which of the following allows simultaneous write and read operations? ",
        correct_answer: "RAM",
        incorrect_answers: ["ROM", "EROM", "None"],
      },
      {
        question:
          "Which of the following is not considered as a peripheral device?",
        correct_answer: "CPU",
        incorrect_answers: ["Keyboard", "Monitor", "All"],
      },
    ],
  },
  Java: {
    results: [
      {
        question:
          "Which of the following is a type of polymorphism in Java Programming?",
        correct_answer: "Compile time polymorphism",
        incorrect_answers: [
          "Multiple polymorphism",
          "Multilevel polymorphism",
          "Execution time polymorphism",
        ],
      },
      {
        question: "What is the return type of Constructors? ",
        correct_answer: "none of the mentioned",
        incorrect_answers: ["int", "float", " void"],
      },
      {
        question: "Which of the following is not an OOPS concept in Java?",
        correct_answer: "Compilation",
        incorrect_answers: ["Polymorphism", "Encapsulation", "Inheritance"],
      },
    ],
  },
  DBMS: {
    results: [
      {
        question:
          "In which of the following formats data is stored in the database management system? ",
        correct_answer: "Table",
        incorrect_answers: ["Graph", "Text", "Image"],
      },
      {
        question: "Which of the following is a function of the DBMS?",
        correct_answer: "All of the above",
        incorrect_answers: [
          " Data Integrity",
          "Providing multi-users access control",
          "Storing data",
        ],
      },
      {
        question: "What is information about data called?",
        correct_answer: "Meta data",
        incorrect_answers: [" Hyper data", "Tera data", "Relations"],
      },
    ],
  },
};

const selected = localStorage.getItem("category");

fetch("").then((res) => {
  return res.json();
});

async function fetchData(s) {
  return data[s];
}

fetchData(selected)
  .then((loadedQuestions) => {
    console.log(loadedQuestions);
    questions = loadedQuestions.results.map((loadedQuestion) => {
      const formattedQuestion = {
        question: loadedQuestion.question,
      };

      // console.log("----", formattedQuestion);

      const answerChoices = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer
      );

      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });
      // console.log(formattedQuestion);
      return formattedQuestion;
    });

    startGame();
  })
  .catch((err) => {
    console.error(err);
  });

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuesions = [...questions];
  getNewQuestion();
  game.classList.remove("hidden");
  loader.classList.add("hidden");
};

getNewQuestion = () => {
  if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    //go to the end page
    return window.location.assign("end.html");
  }
  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  //Update the progress bar
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuesions.length);
  currentQuestion = availableQuesions[questionIndex];
  question.innerHTML = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerHTML = currentQuestion["choice" + number];
  });

  availableQuesions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};
