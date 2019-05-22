require([
    "dojo/dom",
    "dojo/ready",
    "dojo/dom-construct",
    "dijit/form/Button",
    "dijit/Dialog",
    "dojo/on",
    "dojo/keys",
    "dojo/query",
    "dojo/domReady!"
], function (dom, ready, domConstruct, Button, Dialog, on, keys, query) {
    /***************************************************************************
    for (var i = 0; i < 10; i++) {
        domConstruct.create("button", {innerHTML: `${i}`, id: `button${i}`, class: "btn btn-large"}, "calculator")
    }
    domConstruct.create("button", {innerHTML: "Calculator", id: "Calculator", class: "btn"}, "calculator")
    ***************************************************************************/
    
    calcDialog = new Dialog({
        title: "Calculator",
        style: `width: 250px; height: 400px`,
        content: `<span id="calcApp"></span>`
    });

    new Button({
        label: "Calculator",
        id: "calcBtn",
        class: "btn",
        onClick: function(){
            calcDialog.show();
        }
    }).placeAt("calculator").startup();

    //domConstruct.create("h4", { innerHTML: "Problem", id: "input" }, "calcApp");
    //domConstruct.create("h4", { innerHTML: "Solution", id: "output" }, "calcApp");
    domConstruct.create("textarea", { innerHTML: "Problem", rows: "5", readonly: "", id: "input"}, "calcApp");
    domConstruct.create("textarea", { innerHTML: "Solution", rows: "1", readonly: "", id: "output"}, "calcApp");
    var problem = dom.byId("input");
    
    var solution = dom.byId("output");
    var problemArr = [""];
    var difference;
    // creates the numbered calculator buttons
    for (var i = 0; i < 10; i++) {
        new Button({
            label: i,
            id: "button-" + i,
            class: "calcButton",
            onClick: function () {
                if (problemArr.slice(-1) != ")") {
                    problemArr.push(this.label);
                    // join problemArr with no separation then split it along the operators
                    problemArr = problemArr.join('').split(/(?<= \D )|(?= \D )/);
                    // get rid of all leading zeros
                    for (var j = 0; j < problemArr.length; j++) {
                        problemArr[j] = problemArr[j].replace(/^0+(?=\d)/, '');
                    };
                    problem.innerHTML = problemArr.join("");
                    problem.scrollTop = problem.scrollHeight;
                };
            }
        }).placeAt("calcApp").startup();
    }

    var buttonPlus = new Button({
        label: "+",
        id: "plus-btn",
        class: "calcButton",
        onClick: function () {
            checkOperator(this.label);
        }
    }).placeAt("calcApp").startup();

    var buttonMinus = new Button({
        label: "-",
        id: "minus-btn",
        class: "calcButton",
        onClick: function () {
            if (problemArr.join("").split(/(?<= \D )|(?= \D )/).slice(-1) != " - " &&
            problemArr.join("").split("").slice(-1) != ".") {
                problemArr.push(" - ");
                problem.innerHTML = problemArr.join("");
                problem.scrollTop = problem.scrollHeight;
            };
        }
    }).placeAt("calcApp").startup();

    var buttonTimes = new Button({
        label: "*",
        id: "times-btn",
        class: "calcButton",
        onClick: function () {
            checkOperator(this.label);
        }
    }).placeAt("calcApp").startup();

    var buttonDivide = new Button({
        label: "/",
        id: "divide-btn",
        class: "calcButton",
        onClick: function () {
            checkOperator(this.label);
        }
    }).placeAt("calcApp").startup();

    var buttonDecimal = new Button({
        label: ".",
        id: "decimal-btn",
        class: "calcButton",
        onClick: function () {
            // if the current number does not contain a decimal point and the last character is not a closing 
            // parentheses, add a decimal point.
            if (!problemArr[problemArr.length - 1].includes(".") && problemArr.slice(-1) != ")") {
                problemArr.push(`${this.label}`);
                problem.innerHTML = problemArr.join("");
                problem.scrollTop = problem.scrollHeight;
            };
        }
    }).placeAt("calcApp").startup();

    var buttonEquals = new Button({
        label: "=",
        id: "equals-btn",
        class: "calcButton",
        // evaluate the equation and display it in solution.innerHTML rounded to 5 decimal places
        onClick: function () {
            if (problemArr[0] !== "") {
                evalCheck();
                checkParentheses();
                if (difference > 0) {
                    for (var i = 0; i < difference; i++) {
                        problemArr.push(")");
                        problem.innerHTML = problemArr.join("");
                    };
                };
                answer = eval(problem.innerHTML);
                solution.innerHTML = +answer.toFixed(5);
            };
        }
    }).placeAt("calcApp").startup();

    var leftParenth = new Button({
        label: "(",
        id: "left-parenth-btn",
        class: "calcButton",
        onClick: function () {
            if (problemArr.slice(-1) == " + " ||
                problemArr.slice(-1) == " - " ||
                problemArr.slice(-1) == " * " ||
                problemArr.slice(-1) == " / " ||
                problemArr.slice(-1) == "") {
                problemArr.push(`${this.label}`);
                problem.innerHTML = problemArr.join("");
                problem.scrollTop = problem.scrollHeight;
            };
        }
    }).placeAt("calcApp").startup();

    var rightParenth = new Button({
        label: ")",
        id: "right-parenth-btn",
        class: "calcButton",
        onClick: function () {
            checkParentheses();
            if (difference > 0 && problemArr.join("").slice(-1) != "(" && problemArr.join("").slice(-1) != "." && !checkIfOperator()) {
                problemArr.push(`${this.label}`);
                problem.innerHTML = problemArr.join("");
                problem.scrollTop = problem.scrollHeight;
            };
        }
    }).placeAt("calcApp").startup();

    var backspace = new Button({
        label: "⌫",
        id: "backspace-btn",
        class: "calcButton",
        onClick: function () {
            if (checkIfOperator()) {
                problemArr = problemArr.slice(0, -1);
            } else {
                problemArr = problemArr.join("").split("").slice(0, -1).join("").split(/(?<= \D )|(?= \D )/);
            };
            if (problemArr[0] == "" || !problemArr.length) {
                problem.innerHTML = "Problem";
            } else {
                problem.innerHTML = problemArr.join("");
            };
        }
    }).placeAt("calcApp").startup();

    var clear = new Button({
        label: "C",
        id: "clear-btn",
        class: "calcButton",
        onClick: function () {
            problemArr = [""];
            problem.innerHTML = "Problem";
            solution.innerHTML = "Solution";
        }
    }).placeAt("calcApp").startup();
    
    query("textarea").on("keydown", function(event) {
        switch(event.keyCode) {
            case keys.NUMPAD_1:
                event.preventDefault();
                console.log("test")
        }
    });

    checkOperator = function (label) {
        if (problemArr.join("").split(/(?<= \D )|(?= \D )/).slice(-1) == " + " ||
            problemArr.join("").split(/(?<= \D )|(?= \D )/).slice(-1) == " - " ||
            problemArr.join("").split(/(?<= \D )|(?= \D )/).slice(-1) == " * " ||
            problemArr.join("").split(/(?<= \D )|(?= \D )/).slice(-1) == " / " ||
            problemArr.join("").split("").slice(-1) == "(" ||
            problemArr.join("").split("").slice(-1) == ".") {
                problemArr = problemArr.slice(0, -1);
                checkOperator(label);
            } else if(problemArr[0] === "" || !problemArr.length){
                problem.innerHTML = "Problem";
                problemArr = [""];
            } else {
                problemArr.push(` ${label} `);
                problem.innerHTML = problemArr.join("");
                problem.scrollTop = problem.scrollHeight;
            };
    };
    checkParentheses = function () {
        var leftCounter = problemArr.join("").replace(/[^\(]/g, "").length;
        var rightCounter = problemArr.join("").replace(/[^\)]/g, "").length;
        return difference = leftCounter - rightCounter;
    };
    checkIfOperator = function () {
        if (problemArr.slice(-1) == " + " ||
            problemArr.slice(-1) == " - " ||
            problemArr.slice(-1) == " * " ||
            problemArr.slice(-1) == " / ") {
            return true;
        } else {
            return false;
        };
    };
    evalCheck = function() {
        if (problemArr.join("").split("").slice(-1) == "(" ||
        problemArr.join("").split("").slice(-1) == "." ||
        problemArr.join("").split("").slice(-1) == ")" ||
        problemArr.join("").split("").slice(-1) == " ") {
            problemArr = problemArr.slice(0, -1);
            evalCheck();
        };
        if (problemArr.length) {
            problem.innerHTML = problemArr.join('');
        } else {
            problem.innerHTML = "Problem";
        }
        
    };
});
