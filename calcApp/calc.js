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
   
    calcDialog = new Dialog({
        title: "Calculator",
        style: `width: 250px; height: 415px`,
        content: `<span id="calcApp"></span>`
    });

    on(domConstruct.create("div", { "innerHTML": "Calculator", "class": "btn" }, "calculator"), 'click', function(){
        calcDialog.show();
     });
    
    domConstruct.create("textarea", { innerHTML: "Problem", rows: "5", readonly: "", id: "input"}, "calcApp");
    domConstruct.create("textarea", { innerHTML: "Solution", rows: "1", readonly: "", id: "output"}, "calcApp");
    var problem = dom.byId("input");
    var solution = dom.byId("output");
    var problemArr = [""];
    var difference;
    // creates the numbered calculator buttons
    for (var i = 0; i < 10; i++) {
        on(domConstruct.create("div", { "innerHTML": i, "id": "button-" + i, "class": "btn calcButton" }, "calcApp"), 'click', function(){
            numClick(this.innerHTML);
         });
    };

    on(domConstruct.create("div", { "innerHTML": "+", "id": "plus-btn", "class": "btn calcButton" }, "calcApp"), 'click', function(){
        operatorClick(this.innerHTML);
    });

    on(domConstruct.create("div", { "innerHTML": "-", "id": "minus-btn", "class": "btn calcButton" }, "calcApp"), 'click', function(){
        minusClick();
    });

    on(domConstruct.create("div", { "innerHTML": "*", "id": "times-btn", "class": "btn calcButton" }, "calcApp"), 'click', function(){
       operatorClick(this.innerHTML);
    });

    on(domConstruct.create("div", { "innerHTML": "/", "id": "divide-btn", "class": "btn calcButton" }, "calcApp"), 'click', function(){
        operatorClick(this.innerHTML);
     });

    on(domConstruct.create("div", { "innerHTML": ".", "id": "decimal-btn", "class": "btn calcButton" }, "calcApp"), 'click', function(){
        decimalClick();
     });

    on(domConstruct.create("div", { "innerHTML": "=", "id": "equals-btn", "class": "btn calcButton" }, "calcApp"), 'click', function(){
        equalsClick();
    });

    on(domConstruct.create("div", { "innerHTML": "(", "id": "left-parenth-btn", "class": "btn calcButton" }, "calcApp"), "click", function(){
        leftParenthClick();
    });

    on(domConstruct.create("div", { "innerHTML": ")", "id": "right-parenth-btn", "class": "btn calcButton" }, "calcApp"), "click", function(){
        checkParentheses();
        rightParenthClick();
    });
    
    on(domConstruct.create("div", { "innerHTML": "⌫", "id": "backspace-btn", "class": "btn calcButton" }, "calcApp"), "click", function(){
        backspaceClick();
    });
    
    on(domConstruct.create("div", { "innerHTML": "C", "id": "clear-btn", "class": "btn calcButton" }, "calcApp"), "click", function(){
        clearClick();
    });
    
    on(document,"keydown", function(event) {
        switch(event.key) {
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
            case "0":
                numClick(event.key);
                break;
            case "(":
                leftParenthClick();
                break;
            case ")":
                rightParenthClick();
                break;
            case "Backspace":
                backspaceClick();
                break;
            case "c":
                clearClick();
                break;
            case "+":
                operatorClick("+");
                break;
            case "-":
                minusClick();
                break;
            case "*":
                operatorClick("*");
                break;
            case "/":
                operatorClick("/");
                break;
            case "=":
            case "Enter":
                equalsClick();
                break;
            case ".":
                decimalClick();
                break;
            default:
                console.log("not a valid keypress")
        };
    });

    numClick = function (innerHTML) {
        if (problemArr.slice(-1) != ")") {
            problemArr.push(innerHTML);
            // join problemArr with no separation then split it along the operators
            problemArr = problemArr.join('').split(/(?<= \D )|(?= \D )/);
            // get rid of all leading zeros
            for (var j = 0; j < problemArr.length; j++) {
                problemArr[j] = problemArr[j].replace(/^0+(?=\d)/, '');
            };
            problem.innerHTML = problemArr.join("");
            problem.scrollTop = problem.scrollHeight;
        };
    };
    minusClick = function() {
        if (problemArr.join("").split(/(?<= \D )|(?= \D )/).slice(-1) != " - " &&
        problemArr.join("").split("").slice(-1) != ".") {
            problemArr.push(" - ");
            problem.innerHTML = problemArr.join("");
            problem.scrollTop = problem.scrollHeight;
        };
    };
    decimalClick = function() {
        if (!problemArr[problemArr.length - 1].includes(".") && problemArr.slice(-1) != ")") {
            problemArr.push(".");
            problem.innerHTML = problemArr.join("");
            problem.scrollTop = problem.scrollHeight;
        };
    };
    equalsClick = function() {
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
    };
    leftParenthClick = function() {
        if (problemArr.slice(-1) == " + " ||
        problemArr.slice(-1) == " - " ||
        problemArr.slice(-1) == " * " ||
        problemArr.slice(-1) == " / " ||
        problemArr.slice(-1) == "") {
            problemArr.push("(");
            problem.innerHTML = problemArr.join("");
            problem.scrollTop = problem.scrollHeight;
        };
    };
    rightParenthClick = function() {
        if (difference > 0 && problemArr.join("").slice(-1) != "(" && problemArr.join("").slice(-1) != "." && !checkIfOperator()) {
            problemArr.push(")");
            problem.innerHTML = problemArr.join("");
            problem.scrollTop = problem.scrollHeight;
        };
    };
    backspaceClick = function() {
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
    };
    clearClick = function() {
        problemArr = [""];
        problem.innerHTML = "Problem";
        solution.innerHTML = "Solution";
    };

    operatorClick = function (innerHTML) {
        if (problemArr.join("").split(/(?<= \D )|(?= \D )/).slice(-1) == " + " ||
            problemArr.join("").split(/(?<= \D )|(?= \D )/).slice(-1) == " - " ||
            problemArr.join("").split(/(?<= \D )|(?= \D )/).slice(-1) == " * " ||
            problemArr.join("").split(/(?<= \D )|(?= \D )/).slice(-1) == " / " ||
            problemArr.join("").split("").slice(-1) == "(" ||
            problemArr.join("").split("").slice(-1) == ".") {
                problemArr = problemArr.slice(0, -1);
                operatorClick(innerHTML);
            } else if(problemArr[0] === "" || !problemArr.length){
                problem.innerHTML = "Problem";
                problemArr = [""];
            } else {
                problemArr.push(` ${innerHTML} `);
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
