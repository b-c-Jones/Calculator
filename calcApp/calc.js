require([
    "dojo/dom",
    "dojo/dom-construct",
    "dojo/on",
    "dojo/domReady!"
], function (dom, domConstruct, on) {

    var calcIsActive = false;

    // Create a button. When clicked, a Calcite Modal is created that contains a calculator and calcIsActive is set to true. 
    //If the calcite Modal already exists, show it instead. 
    on(domConstruct.create("div", { "innerHTML": "Calculator", "class": "btn" }, "calculator"), 'click', function () {
        if (!document.getElementById("calcOverlay")) {
            _calciteCalculator();
        } else {
            calcOverlay.classList.add("is-active");
        };
        calcIsActive = true;
    });

    // The function that creates the calculator Modal.
    function _calciteCalculator() {
        var columns = 6;
        var calcOverlay = domConstruct.create("div", { class: "modal-overlay is-active", id: "calcOverlay" }, document.body);
        var calcContent = domConstruct.create("div", { class: "modal-content column-" + columns, "role": "dialog", "aria-labelledby": "modal", id: "calcApp" }, calcOverlay);
        domConstruct.create("header", { class: "text-blue", id: "calcAppHeader", innerHTML: "Calculator" }, calcContent);
        var closeBtn = domConstruct.create("button", { class: "btn btn-small", id: "closeBtn", innerHTML: "X" }, calcContent);
        // When you close the calculator, remove the "is-active" class form calcOverlay and set calcIsActive to false.
        on(closeBtn, "click", function () {
            calcOverlay.classList.remove("is-active");
            calcIsActive = false;
        });
        // Every time the Modal is created, call the dragElement and calcCreate functions
        dragElement(document.getElementById("calcApp"));
        calcCreate();
    };

    //The dragElement function makes the Calculator Modal draggable:
    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        document.getElementById(elmnt.id + "Header").onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // calcCreate creates the calculator in the (mostly) empty calciteCalculator Modal.
    function calcCreate() {
        domConstruct.create("textarea", { innerHTML: "Problem", id: "input", rows: "6", disabled: "" }, "calcApp");
        domConstruct.create("textarea", { innerHTML: "Solution", id: "output", rows: "1", disabled: "" }, "calcApp");
        var problem = dom.byId("input");
        var solution = dom.byId("output");
        var problemArr = [""];
        var difference;
        // creates the numbered calculator buttons
        for (var i = 0; i < 10; i++) {
            on(domConstruct.create("div", { "innerHTML": i, "id": "button-" + i, "class": "btn calcButtons" }, "calcApp"), 'click', function () {
                numClick(this.innerHTML);
            });
        };
        // create the non number buttons
        on(domConstruct.create("div", { "innerHTML": "+", "id": "plus-btn", "class": "btn calcButtons" }, "calcApp"), 'click', function () {
            operatorClick(this.innerHTML);
        });

        on(domConstruct.create("div", { "innerHTML": "-", "id": "minus-btn", "class": "btn calcButtons" }, "calcApp"), 'click', function () {
            minusClick();
        });

        on(domConstruct.create("div", { "innerHTML": "*", "id": "times-btn", "class": "btn calcButtons" }, "calcApp"), 'click', function () {
            operatorClick(this.innerHTML);
        });

        on(domConstruct.create("div", { "innerHTML": "/", "id": "divide-btn", "class": "btn calcButtons" }, "calcApp"), 'click', function () {
            operatorClick(this.innerHTML);
        });

        on(domConstruct.create("div", { "innerHTML": ".", "id": "decimal-btn", "class": "btn calcButtons" }, "calcApp"), 'click', function () {
            decimalClick();
        });

        on(domConstruct.create("div", { "innerHTML": "=", "id": "equals-btn", "class": "btn calcButtons" }, "calcApp"), 'click', function () {
            equalsClick();
        });

        on(domConstruct.create("div", { "innerHTML": "(", "id": "left-parenth-btn", "class": "btn calcButtons" }, "calcApp"), "click", function () {
            leftParenthClick();
        });

        on(domConstruct.create("div", { "innerHTML": ")", "id": "right-parenth-btn", "class": "btn calcButtons" }, "calcApp"), "click", function () {
            checkParentheses();
            rightParenthClick();
        });

        on(domConstruct.create("div", { "innerHTML": "⌫", "id": "backspace-btn", "class": "btn calcButtons" }, "calcApp"), "click", function () {
            backspaceClick();
        });

        on(domConstruct.create("div", { "innerHTML": "C", "id": "clear-btn", "class": "btn calcButtons" }, "calcApp"), "click", function () {
            clearClick();
        });

        // on clicking or typing a number, checks if adding a number is allowed. if so, pushes the clicked/typed number to the end of the input textbox.
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

        // on clicking or typing the minus symbol, checks if adding a minus is allowed. if so, pushes a minus symbol to the end of the input textbox.
        minusClick = function () {
            if (problemArr.join("").split(/(?<= \D )|(?= \D )/).slice(-1) != " - " &&
                problemArr.join("").split("").slice(-1) != ".") {
                problemArr.push(" - ");
                problem.innerHTML = problemArr.join("");
                problem.scrollTop = problem.scrollHeight;
            };
        };

        // on clicking or typing the decimal point, checks if adding a decimal is allowed. if so, pushes a decimal point onto the end of the input textbox.
        decimalClick = function () {
            if (!problemArr[problemArr.length - 1].includes(".") && problemArr.slice(-1) != ")") {
                problemArr.push(".");
                problem.innerHTML = problemArr.join("");
                problem.scrollTop = problem.scrollHeight;
            };
        };

        // on clicking the equals button, typing equals, or hitting the enter key, evaluates the text in the input textbox and displays the answer in the output textbox.
        equalsClick = function () {
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

        // on clicking or typing a left parentheses, check if adding a left parenth is allowed. If so, push it onto the end of the input textbox.
        leftParenthClick = function () {
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

        // on clicking or typing a right parentheses, check if adding a right parenth is allowed. If so, push it onto the end of the input textbox.
        rightParenthClick = function () {
            if (difference > 0 && problemArr.join("").slice(-1) != "(" && problemArr.join("").slice(-1) != "." && !checkIfOperator()) {
                problemArr.push(")");
                problem.innerHTML = problemArr.join("");
                problem.scrollTop = problem.scrollHeight;
            };
        };

        // on clicking ⌫ or hitting backspace, delete the last character added. if the input textbox is now empty, add placeholder text "Problem".
        backspaceClick = function () {
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

        // on clicking the "C" button or typing "c", clear the calculator.
        clearClick = function () {
            problemArr = [""];
            problem.innerHTML = "Problem";
            solution.innerHTML = "Solution";
        };

        // on clicking or typing any non minus operator, check if adding that operator is allowed. if so, add it. if not, replace the previous character
        operatorClick = function (innerHTML) {
            if (problemArr.join("").split(/(?<= \D )|(?= \D )/).slice(-1) == " + " ||
                problemArr.join("").split(/(?<= \D )|(?= \D )/).slice(-1) == " - " ||
                problemArr.join("").split(/(?<= \D )|(?= \D )/).slice(-1) == " * " ||
                problemArr.join("").split(/(?<= \D )|(?= \D )/).slice(-1) == " / " ||
                problemArr.join("").split("").slice(-1) == "(" ||
                problemArr.join("").split("").slice(-1) == ".") {
                problemArr = problemArr.slice(0, -1);
                operatorClick(innerHTML);
            } else if (problemArr[0] === "" || !problemArr.length) {
                problem.innerHTML = "Problem";
                problemArr = [""];
            } else {
                problemArr.push(` ${innerHTML} `);
                problem.innerHTML = problemArr.join("");
                problem.scrollTop = problem.scrollHeight;
            };
        };

        // check how many more left parentheses there are than right, and return the difference.
        checkParentheses = function () {
            var leftCounter = problemArr.join("").replace(/[^\(]/g, "").length;
            var rightCounter = problemArr.join("").replace(/[^\)]/g, "").length;
            return difference = leftCounter - rightCounter;
        };

        // check if the last character in input is an operator
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

        // removes trailing parentheses, decimal points, and operators. if input is now empty, add placeholder text "Problem"
        evalCheck = function () {
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
    }
    
    // keydowns simulate clicking calculator buttons only if calcApp is showing. 
    on(document, "keydown", function (event) {
        if (calcIsActive) {
            switch (event.key) {
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
                    checkParentheses();
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
                case "x":
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
                case "Escape":
                    calcOverlay.classList.remove("is-active");
                    break;
                default:
                    console.log(event.key + " is not a valid keypress")
            };
        };
    });
});
