var dayPoints;
var ration;
var day = new Day();
var difficultes;
var concentration;
var actions = JSON.parse(localStorage.getItem("actions"));
var passedActions;
var passedTime
console.log(addNewAction);
var actionsResult = document.getElementById('actions_ul');
var timer = document.getElementById("timer");
var watch = new StopWatch(timer);
var action_text = document.getElementById("action");
var days = [];
var addNewAction = document.getElementById("add_new_action").addEventListener("click", saveActions);
var concentrationDescription = document.getElementById("concentration_description");
var pointsForDay = document.getElementById("points_for_day");


var start = document.getElementById("start");
start.addEventListener("click", displayAction);

var skip = document.getElementById("skip");
skip.addEventListener("click", skipAction);

var accept = document.getElementById("accept");
accept.addEventListener("click", acceptAction);

var toggleBtn = document.getElementById("toggle_btn");
toggleBtn.addEventListener('click', function () {
    (watch.isOn) ? stopTimer() : startTimer();
});

var resetBtn = document.getElementById("reset_btn");
resetBtn.addEventListener('click', function () {
    watch.reset();
});


var end = document.getElementById("end");
end.addEventListener("click", endAction);


var bad = document.getElementById("bad");
bad.addEventListener("click", badAction);

var normal = document.getElementById("normal");
normal.addEventListener("click", normalAction);

var good = document.getElementById("good");
good.addEventListener("click", goodAction);

var great = document.getElementById("great");
great.addEventListener("click", greatAction);

var easyDiff = document.getElementById("easy_diff");
easyDiff.addEventListener("click", easyDifficulties);

var normalDiff = document.getElementById("normal_diff");
normalDiff.addEventListener("click", normalDifficulties);

var hardDiff = document.getElementById("hard_diff");
hardDiff.addEventListener("click", hardDifficulties);



function saveActions(e) {

    var actionName = document.getElementById("action_input").value;
    var actionRatio = document.getElementById("ratio_input").value;
    actionRatio = parseInt(actionRatio);
    if (!actionName || !actionRatio) {
        alert("Вы не ввели название дела или весовой коэффициет");
        return false;
    }

    if (actionRatio <= 0 || actionRatio > 6) {
        alert("Коэфициет важности дела должен быть больше нуля и мменьше шести\n"
            + " 1 - Совершенно неважное дело 2 - Неважное дело 3 - среднее по важности дело 4 - Давольно важное дело 5 - Очень важное дело 6 - Критически важное дело");
        return false;
    }

    console.log(actionRatio, actionName);

    var action = new Action(actionName, actionRatio);
    console.log(action);

    if (localStorage.getItem("actions") === null) {
        actions = [];
        actions.push(action);
        // Занести массив в локальную память
        localStorage.setItem('actions', JSON.stringify(actions));
    } else {
        actions = JSON.parse(localStorage.getItem("actions"));
        actions.push(action);
        localStorage.setItem('actions', JSON.stringify(actions));
    }

    document.getElementById('action_form').reset();
    e.preventDefault();
    actionsResult.innerHTML = '';
    fetchActions();

}

function hide() {
    for (var i = 0; i < arguments.length; i++) {
        arguments[i].classList.add("hide");
    }
}

function unhide() {
    for (var i = 0; i < arguments.length; i++) {
        arguments[i].classList.remove("hide");
    }
}


function fetchActions() {
    console.log(actions);

    console.log(actionsResult);

    actionsResult.innerHTML = '';

    for (var i = 0; i < actions.length; i++) {

        var name = actions[i].name;
        actionsResult.innerHTML += ' <li><span>' + name + '<i class="fa fa-trash" onclick="deleteAction(\'' + name + '\')" aria-hidden="true"></i></span></li>';
    }

}

function deleteAction(name) {
    actions.forEach(function (item, i) {
        if (item.name === name) {
            actions.splice(i, 1);
        }
    })

    localStorage.setItem("actions", JSON.stringify(actions));
    actionsResult.innerHTML = "";
    fetchActions();
}


function displayAction() {
    if (!actions) {
        alert("Сначала нужно добавить хотя бы одно случайное дело!");
        return false;
    }
    var randomNumber = Math.floor(getRandomNumber(0, actions.length - 1));
    var randomElName = actions[randomNumber].name;
    var action_text = document.getElementById("action");
    action_text.textContent = randomElName;
    unhide(skip, accept);
    hide(start);
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function skipAction() {

    var randomNumber = getRandomNumber(0, actions.length);
    var randomElName = actions[randomNumber].name;
    action_text.textContent = randomElName;

}

function acceptAction() {
    unhide(end, timer, toggleBtn, resetBtn);
    console.log(skip);
    console.log(accept);
    console.log(watch);
    hide(skip, accept);
    watch.start();
}

function stopTimer() {
    watch.stop();
    toggleBtn.textContent = "Запустить";
}

function startTimer() {
    watch.start();
    toggleBtn.textContent = "Пауза";
}

function endAction() {

    passedTime = parseInt(timer.innerHTML); // первые 2 числа со строки до 99 минт
    watch.reset();
    watch.stop();

    for (var i = 0; i < actions.length; i++) {
        if (actions[i].name === action_text.textContent) {

            console.log(actions[i]);
            actions[i].minutes += passedTime;
            console.log(actions[i].minutes);
        }
    }


    localStorage.setItem("actions", JSON.stringify(actions));

    hide(end, timer, toggleBtn, resetBtn);
    unhide(bad, normal, good, great, concentrationDescription);


}

var difTitle = document.getElementById("diff");

function badAction() {
    concentration = 0.5;
    hide(bad, normal, good, great);
    unhide(easyDiff, normalDiff, hardDiff, difTitle);
}

function goodAction() {
    concentration = 1.5;
    hide(bad, normal, good, great);
    unhide(easyDiff, normalDiff, hardDiff, difTitle);
}

function normalAction() {
    concentration = 1;
    hide(bad, normal, good, great);
    unhide(easyDiff, normalDiff, hardDiff, difTitle);
}


function greatAction() {
    concentration = 2;
    hide(bad, normal, good, great, concentrationDescription);
    unhide(easyDiff, normalDiff, hardDiff, difTitle);
}

function easyDifficulties() {
    difficultes = 0.5;
    day.points += difficultes * concentration * passedTime * getRatioOfCurrentAction();
    // day.points +=
    days.pop();
    days.push(day);
    localStorage.setItem("days", JSON.stringify(days));
    console.log(day.points);
    hide(bad, normal, good, great, concentrationDescription, easyDiff, normalDiff, hardDiff, difTitle);
    unhide(start);
    updatePoints();
}

function normalDifficulties() {
    difficultes = 1;
    day.points += difficultes * concentration * passedTime * getRatioOfCurrentAction();
    // day.points += 50;
    days.pop();
    days.push(day);
    localStorage.setItem("days", JSON.stringify(days));
    console.log(day.points);
    hide(bad, normal, good, great, concentrationDescription, easyDiff, normalDiff, hardDiff, difTitle);
    unhide(start);
    updatePoints();
}

function hardDifficulties() {
    difficultes = 1.7;
    day.points += difficultes * concentration * passedTime * getRatioOfCurrentAction();
    // day.points += 50;
    days.pop();
    days.push(day);
    localStorage.setItem("days", JSON.stringify(days));
    console.log(day.points);
    hide(bad, normal, good, great, concentrationDescription, easyDiff, normalDiff, hardDiff, difTitle);
    unhide(start);
    updatePoints();
}


function getRatioOfCurrentAction(){
    for (var i = 0; i < actions.length; i++) {
        if (actions[i].name = action_text.textContent) {
            return actions[i].importance;
        }
    }

}

function updatePoints(){
    pointsForDay.textContent = Math.round(day.points);
}


(function findDay() {
    if (localStorage.getItem("days") !== null) {
        days = JSON.parse(localStorage.getItem("days"));
        if (days[days.length - 1].date[2] === day.date[2] &&
            days[days.length - 1].date[1] === day.date[1] &&
            days[days.length - 1].date[0] === day.date[0]) {
            dayPoints = days[days.length - 1].points;
            day = days[days.length - 1];
            console.log("TRUUUUUE");
            console.log(dayPoints);
        }
        else {
            console.log("fAAAAALSE");
            days.push(day);
            localStorage.setItem("days", JSON.stringify(days));
        }
    } else {
        days.push(day);
        localStorage.setItem("days", JSON.stringify(days));
    }
    console.log(day);
    updatePoints();
})();

