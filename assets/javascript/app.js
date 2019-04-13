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

    var display = {
        start: {

        },
        question: {

        },
        answer: {

        },
        gameOver: {

        }
    };

    var trivia = {
        id: {
            question: "",
            answer: "",
            choices: [],
        }
    };

    var timer = {
        game: 0,
        question: 0,
        answer: 0
    };

    var hooks = {
        message: ""
    }

    $(document).on("click", "#start-btn", start);

    function start() {
        game.action = "start"

        hooks.message = game.action;
        console.log(hooks.message);
    }
});