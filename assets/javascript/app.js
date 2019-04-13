$(document).ready(function () {
  var game = {
    status: "start", // start, question, answer, game over
    action: "",
    summary: {
      total: 0,
      correct: 0,
      incorrect: 0,
      unanswered: 0
    }
  };

  var display = { // Question to TAs: How would one go about simplifying this object, since function calls need to be synchronous with the timer
    initialize: function() {
      $("#start").addClass("hide");
      $("#question").addClass("hide");
      $("#answer").addClass("hide");
      $("#game-over").addClass("hide");
    },
    start: function() {
      this.initialize();
      $("#start").removeClass("hide");
    },
    question: function() {
      // this.initialize();

      // Fix for scope change
      $("#start").addClass("hide");
      $("#question").addClass("hide");
      $("#answer").addClass("hide");
      $("#game-over").addClass("hide");

      $("#question").removeClass("hide");
    },
    answer: function() {
      // this.initialize();

      // Fix for scope change
      $("#start").addClass("hide");
      $("#question").addClass("hide");
      $("#answer").addClass("hide");
      $("#game-over").addClass("hide");

      $("#answer").removeClass("hide");
    },
    gameOver: function() {
      // this.initialize();

      // Fix for scope change
      $("#start").addClass("hide");
      $("#question").addClass("hide");
      $("#answer").addClass("hide");
      $("#game-over").addClass("hide");

      $("#game-over").removeClass("hide");
    }
  };

  var trivia = {
    version: 1,
    items: {
      first: {
        id: 0,
        question: "",
        answer: "",
        choices: [
          "Question " + this.id + ", choice a",
          "Question " + this.id + ", choice b",
          "Question " + this.id + ", choice c",
          "Question " + this.id + ", choice d"
        ],
        asked: false
      },
      second: {
        id: 1,
        question: "",
        answer: "",
        choices: [
          "Question " + this.id + ", choice a",
          "Question " + this.id + ", choice b",
          "Question " + this.id + ", choice c",
          "Question " + this.id + ", choice d"
        ]
      },
      third: {
        id: 2,
        question: "",
        answer: "",
        choices: [
          "Question " + this.id + ", choice a",
          "Question " + this.id + ", choice b",
          "Question " + this.id + ", choice c",
          "Question " + this.id + ", choice d"
        ],
        asked: false
      },
      fourth: {
        id: 3,
        question: "",
        answer: "",
        choices: [
          "Question " + this.id + ", choice a",
          "Question " + this.id + ", choice b",
          "Question " + this.id + ", choice c",
          "Question " + this.id + ", choice d"
        ],
        asked: false
      },
    }
  };

  var timer = {
    question: {
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

  function start() {
    game.action = "start";
    display.question();

    // Start question timer, change display if timer expires
    timer.question.start(display.answer);

    hooks.update(game.action);
  }
});