$(document).ready(function () {
  var player;
  var computer;

  var game = {
    status: "start", // start, question, answer, game over
    action: "",
    time: 5,
    remaining: 5,
    guess: 0,
    summary: {
      total: 0,
      correct: 0,
      incorrect: 0,
      unanswered: 0
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
      // this.initialize();

      // Fix for scope change
      $("#start").addClass("hide");
      $("#answer").addClass("hide");
      $("#game-over").addClass("hide");

      $("#question").removeClass("hide");
      var questionDiv = $("<div>");
      var i;

      questionDiv.text(text);
      $("#question-container").html(questionDiv)

      for (i = 0; i < array.length; i++) {
        var choiceDiv = $("<div>");

        choiceDiv.text(array[i])
        choiceDiv.addClass("choice");
        choiceDiv.attr("data-value", i);

        $("#choice-container").append(choiceDiv);
      }
    },
    answer: function () {
      // this.initialize();

      // Fix for scope change
      $("#start").addClass("hide");
      $("#question").addClass("hide");
      $("#game-over").addClass("hide");

      $("#answer").removeClass("hide");
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
    question: "Michael Jordan played college basketball at which university?",
    choices: [
      "UCLA", 
      "Kentucky", 
      "Duke", 
      "North Carolina"
    ]
  };

  var timer = {
    question: {
      number: 5,
      set: 0,
      start: function (newDisplay) {
        this.set = setTimeout(newDisplay, 5000);
      },
      stop: function () {
        clearTimeout(this.set);
      }
    },
    answer: {
      set: 0,
      start: function () {
        this.set = setTimeout(function () {
          console.log("Time's up");
        }, 3000);
      },
      stop: function () {
        clearTimeout(this.set);
      }
    }
  };

  var hooks = {
    message: "",
    update: function (msg) {
      this.message = msg;
      console.log(msg);
    }
  }

  $(document).on("click", "#start-btn", start);
  $(document).on("click", ".choice", choose);

  function start() {
    game.action = "start";
    display.question(trivia.question, trivia.choices);
    display.updateTimer(game.remaining); // Initialize the countdown timer

    // Start question timer, change display if timer expires
    // timer.question.start(display.answer);

    run();

    hooks.update(game.action);
  }

  function choose() {
    userGuess = $(this).attr("data-value");

    stop();

    game.action = "guess: " + userGuess;
    game.remaining = game.time;
    display.answer();

    hooks.update(game.action);
  }

  function run() {
    player = setInterval(countdown, 1000);
  }

  function stop() {
    clearInterval(player);
  }

  function countdown() {
    game.remaining--;

    if (game.remaining === 0) {
      stop();

      game.action = "time expired";
      game.remaining = game.time;
      display.answer();

      hooks.update(game.action);
    }

    display.updateTimer(game.remaining);
  }

  function random() {
    return 0; //this.pack[Math.floor(Math.random() * this.pack.length)];
  }

});