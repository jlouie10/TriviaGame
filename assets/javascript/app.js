$(document).ready(function () {
  var player;
  var computer;

  var game = {
    status: "start", // start, question, answer, game over
    duration: 4, // Rounds of questions to ask
    guess: "",
    timer: {
      question: {
        reference: "",
        start: 5,
        remaining: 0
      },
      answer: {
        reference: "",
        start: 5,
        remaining: 0
      }
    },
    questionsLeft: {
      array: [], // Tracks the index of the questions left to avoid asking repeated questions
      update: function (index) { // Removes the last asked question's index from the array
        var i;

        for (i = 0; i < this.array.length; i++) {
          if (this.array[i] === index) {
            this.array.splice(i, 1);
          }
        }
      }
    },
    summary: {
      total: 0,
      correct: 0,
      incorrect: 0,
      unanswered: 0
    },
    currentQuestion: {
      id: 0,
      text: "",
      guesses: [],
      answer: 0,
      gif: ""
    },
    getQuestion: function (id, text, guesses, answer, gif) {
      this.currentQuestion.id = id;
      this.currentQuestion.text = text;
      this.currentQuestion.guesses = guesses;
      this.currentQuestion.answer = answer;
      this.currentQuestion.gif = gif;
    }
  };

  // Question to TAs: How would one go about simplifying this object, since function calls need to be synchronous with the timer
  // Removed initialization function: scoping issue generated errors, and function was sometimes redundant
  var display = {
    question: function (text, array) {
      var questionDiv = $("<div>");
      var i;

      $("#start").addClass("hide");
      $("#answer").addClass("hide");
      $("#game-over").addClass("hide");

      // Initialize containers
      $("#guess-container").empty();

      $("#question").removeClass("hide");

      questionDiv.html(text);

      $("#question-container").html(questionDiv)

      for (i = 0; i < array.length; i++) {
        var guessDiv = $("<div>");

        guessDiv.html(array[i])
        guessDiv.addClass("guess");
        guessDiv.attr("data-value", i);

        $("#guess-container").append(guessDiv);
      }
    },
    answer: function (guess, answer, message, image) {
      var messageDiv = $("<div>");
      var correctDiv = $("<div>");
      var gifDiv = $("<img>");

      // this.initialize();

      // Fix for scope change
      $("#question").addClass("hide");

      // Initialize containers
      $("#answer-message").empty();
      $("#answer-gif").empty();

      $("#answer").removeClass("hide");

      if (guess == answer) {
        messageDiv.html("correct!");
        correctDiv.empty();
        gifDiv.attr("src", image.correct);

      }
      else {
        if (guess === 4) {
          messageDiv.html("time's up!");
        }
        else {
          messageDiv.html("wrong!");
        }

        correctDiv.html("the correct answer is " + message);
        gifDiv.attr("src", image.incorrect);

        $("#answer-message").append(correctDiv);
      }

      $("#answer-message").prepend(messageDiv); // prepend to put message before correct answer
      $("#answer-gif").append(gifDiv);
    },
    gameOver: function (correct, incorrect, unanswered) {
      var array = [correct, incorrect, unanswered];
      var scoreboardDiv = $("<div>");
      var i;

      // this.initialize();

      // Fix for scope change
      $("#answer").addClass("hide");

      $("#game-over").removeClass("hide");

      $("#scoreboard").empty();

      for (i = 0; i < array.length; i++) {
        var newDiv = $("<div>");
        newDiv.html(array[i]);
        scoreboardDiv.append(newDiv);
      }

      $("#scoreboard").append(scoreboardDiv);
    },
    updateTimer: function (number) {
      $("#question-timer").html("<span>" + number + "</span>")
    }
  };

  var trivia = {
    version: 0,
    questions: [
      {
        id: 0,
        text: "Michael Jordan played college basketball at which university?",
        guesses: [
          "UCLA",
          "Kentucky",
          "Duke",
          "North Carolina"
        ],
        answer: 3,
        gif: {
          correct: "https://media.giphy.com/media/YTbZzCkRQCEJa/giphy.gif",
          incorrect: "https://media.giphy.com/media/ceeN6U57leAhi/giphy.gif"
        }
      },
      {
        id: 1,
        text: "How many Super Bowls has Tom Brady won?",
        guesses: [
          "Three",
          "Four",
          "Five",
          "Six"
        ],
        answer: 3,
        gif: {
          correct: "https://media.giphy.com/media/YTbZzCkRQCEJa/giphy.gif",
          incorrect: "https://media.giphy.com/media/ceeN6U57leAhi/giphy.gif"
        }
      },
      {
        id: 2,
        text: "Which male tennis player holds the record for most Grand Slam wins ever?",
        guesses: [
          "Björn Borg",
          "Pete Sampras",
          "Rodger Federer",
          "Rafael Nadal"
        ],
        answer: 2,
        gif: {
          correct: "https://media.giphy.com/media/YTbZzCkRQCEJa/giphy.gif",
          incorrect: "https://media.giphy.com/media/ceeN6U57leAhi/giphy.gif"
        }
      },
      {
        id: 3,
        text: "Baseball's award for best pitcher is named after which player?",
        guesses: [
          "Babe Ruth",
          "Cy Young",
          "Nolan Ryan",
          "Roger Clemens"
        ],
        answer: 1,
        gif: {
          correct: "https://media.giphy.com/media/YTbZzCkRQCEJa/giphy.gif",
          incorrect: "https://media.giphy.com/media/ceeN6U57leAhi/giphy.gif"
        }
      }
    ]
  };

  // Events
  $(document).on("click", "#start-btn", start);
  $(document).on("click", ".guess", guess);
  $(document).on("click", "#answer-btn", next);
  $(document).on("click", "#reset-btn", start);

  // Initialization functions
  function initializeGame() {
    var i;

    // Initialize game properties
    game.summary.total = 0;
    game.summary.correct = 0;
    game.summary.incorrect = 0;
    game.summary.unanswered = 0;

    // Reset timers
    game.timer.question.remaining = game.timer.question.start;
    game.timer.answer.remaining = game.timer.answer.start;

    // Initialize game.questionsLeft array and fill with values
    for (i = 0; i < trivia.questions.length; i++) {
      game.questionsLeft.array[i] = i;
    }
  }

  // Main functions
  function start() {

    initializeGame();
    
    game.status = "ask question";
    
    askQuestion();
  }

  function askQuestion() { // Asks player a new question and provides guesses

    // Randomly index a question from the trivia pack
    var index = rng(trivia.questions);

    // Set current question parameters
    var id = trivia.questions[index].id;
    var question = trivia.questions[index].text;
    var guesses = trivia.questions[index].guesses;
    var answer = trivia.questions[index].answer;
    var gif = trivia.questions[index].gif;

    game.getQuestion(id, question, guesses, answer, gif);
    game.questionsLeft.update(index);

    updateDisplay("true");
    startQuestionTimer();
  }

  function guess() {
    game.guess = $(this).attr("data-value");

    stopQuestionTimer();

    if (game.guess == game.currentQuestion.answer) {
      game.summary.correct++;
    }
    else {
      game.summary.incorrect++;
    }

    game.status = "show answer";

    updateDisplay("true");

    startAnswerTimer();
  }

  function next() {
    if (game.questionsLeft.array.length === 0) {
      game.status = "game over";

      updateDisplay("true");
    }
    else {
      game.status = "ask question";
      
      askQuestion();
    }

    stopAnswerTimer();
  }

  function updateDisplay(message) {

    if (message === "time expired") {
      display.answer(4,
        game.currentQuestion.answer,
        game.currentQuestion.guesses[game.currentQuestion.answer],
        game.currentQuestion.gif);
    }
    else if (message === "update timer") {
      display.updateTimer(game.timer.question.remaining);
    }
    else if (game.status === "ask question") {
      display.question(game.currentQuestion.text, game.currentQuestion.guesses);
      display.updateTimer(game.timer.question.remaining); // Initialize the countdown timer
    }
    else if (game.status === "show answer") {
      display.answer(game.guess,
        game.currentQuestion.answer,
        game.currentQuestion.guesses[game.currentQuestion.answer],
        game.currentQuestion.gif);
    }
    else if (game.status === "game over") {
      display.gameOver(game.summary.correct, game.summary.incorrect, game.summary.unanswered);
    }
  }

  // Timers

  function startQuestionTimer() {
    game.timer.question.reference = setInterval(countdown, 1000);

    console.log("Question timer started");
  }

  function startAnswerTimer() {
    game.timer.answer.reference = setInterval(countdownHidden, 1000);

    console.log("Answer timer started");
  }

  function stopQuestionTimer() {
    clearInterval(game.timer.question.reference);

    game.timer.question.remaining = game.timer.question.start;
    game.summary.total++;

    console.log("Question timer stopped");
  }

  function stopAnswerTimer() {
    clearInterval(game.timer.answer.reference);

    game.timer.answer.remaining = game.timer.answer.start;

    console.log("Answer timer stopped");
  }

  function countdown() {
    game.timer.question.remaining--;

    console.log("Question timer: " + game.timer.question.remaining);

    if (game.timer.question.remaining === 0) {

      stopQuestionTimer();

      game.summary.unanswered++;

      game.status = "show answer"

      updateDisplay("time expired");

      startAnswerTimer();
    }
    
    updateDisplay("update timer");
  }

  function countdownHidden() {
    game.timer.answer.remaining--;

    console.log("Answer timer: " + game.timer.answer.remaining);

    if (game.timer.answer.remaining === 0) {
      stopAnswerTimer();

      if (game.questionsLeft.array.length === 0) {
        game.status = "game over";

        updateDisplay("true");
      }
      else {
        game.status = "ask question";

        askQuestion();
      }
    }
  }

  // Random number generator that returns the index of a question that hasn't been asked
  function rng(array) {
    var index = 0;

    if (game.questionsLeft.array.length === index) {
      return game.questionsLeft[0];
    }
    else {
      index = Math.floor(Math.random() * game.questionsLeft.array.length);

      return game.questionsLeft.array[index];
    }
  }
});