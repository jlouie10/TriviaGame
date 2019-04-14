$(document).ready(function () {
  var player;
  var computer;

  var game = {
    status: "start", // start, question, answer, game over
    duration: 4,
    timeStart: 5,
    timeRemaining: 0,
    questionsLeft: [], // tracks the index of the questions left 
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

  var display = { // Question to TAs: How would one go about simplifying this object, since function calls need to be synchronous with the timer
    initialize: function () {
      $("#start").addClass("hide");
      $("#question").addClass("hide");
      $("#answer").addClass("hide");
      $("#game-over").addClass("hide");
    },
    start: function () {
      this.initialize();
      $("#start").removeClass("hide");
    },
    question: function (text, array) {
      var questionDiv = $("<div>");
      var i;

      // this.initialize();

      // Fix for scope change
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
      $("#start").addClass("hide");
      $("#question").addClass("hide");
      $("#game-over").addClass("hide");

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
    gameOver: function () {
      // this.initialize();

      // Fix for scope change
      $("#start").addClass("hide");
      $("#question").addClass("hide");
      $("#answer").addClass("hide");

      $("#game-over").removeClass("hide");
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

  $(document).on("click", "#start-btn", start);
  $(document).on("click", ".guess", guess);
  $(document).on("click", "#answer-btn", next);


  function start() {
    var i;

    // Initialize timer
    game.timeRemaining = game.timeStart;

    for (i = 0; i < trivia.questions.length; i++) {
      game.questionsLeft[i] = i;
    }

    askQuestion();
  }

  // Asks player a new question and provides guesses
  function askQuestion() {

    // Randomly index a question from the trivia pack
    var index = rng(trivia.questions);

    // Set current question parameters
    var id = trivia.questions[index].id;
    var question = trivia.questions[index].text;
    var guesses = trivia.questions[index].guesses;
    var answer = trivia.questions[index].answer;
    var gif = trivia.questions[index].gif;

    updateTracker(index);

    game.getQuestion(id, question, guesses, answer, gif);

    display.question(game.currentQuestion.text, game.currentQuestion.guesses);
    display.updateTimer(game.timeRemaining); // Initialize the countdown timer

    run();
  }

  // Updates array of questions left to avoid repeated questions
  function updateTracker(index) {
    var i;

    for (i = 0; i < game.questionsLeft.length; i++) {
      if (game.questionsLeft[i] === index) {
        game.questionsLeft.splice(i, 1);
      }
    }
  }

  // Random number generator that returns the index of a question that hasn't been asked
  function rng(array) {
    var index = 0;

    if (game.questionsLeft.length === index) {
      return game.questionsLeft[0];
    }
    else {
      index = Math.floor(Math.random() * game.questionsLeft.length);

      return game.questionsLeft[index];
    }
  }

  function guess() {
    userGuess = $(this).attr("data-value");

    stop();

    if (userGuess === game.currentQuestion.answer) {
      game.summary.correct++;
    }
    else {
      game.summary.incorrect++;
    }

    display.answer(userGuess,
      game.currentQuestion.answer,
      game.currentQuestion.guesses[game.currentQuestion.answer],
      game.currentQuestion.gif);
  }

  function next() {
    if (game.questionsLeft.length === 0) {
      display.gameOver();
    }
    else {
      askQuestion();
    }
  }

  function run() {
    player = setInterval(countdown, 1000);
  }

  function stop() {
    clearInterval(player);
    game.timeRemaining = game.timeStart;
    game.summary.total++;
  }

  function countdown() {
    game.timeRemaining--;

    if (game.timeRemaining === 0) {
      stop();

      game.summary.unanswered++;
      display.answer(4,
        game.currentQuestion.answer,
        game.currentQuestion.guesses[game.currentQuestion.answer],
        game.currentQuestion.gif);
    }

    console.log(game.timeRemaining);

    display.updateTimer(game.timeRemaining);
  }

  function random() {
    rand = Math.floor(Math.random() * trivia.questions.length);

    return rand;
  }

});