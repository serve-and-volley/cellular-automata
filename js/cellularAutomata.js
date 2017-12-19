function rule2decimal() {
    var rule = [
        parseInt(document.getElementById("binary-value-1").innerHTML),
        parseInt(document.getElementById("binary-value-2").innerHTML),
        parseInt(document.getElementById("binary-value-3").innerHTML),
        parseInt(document.getElementById("binary-value-4").innerHTML),
        parseInt(document.getElementById("binary-value-5").innerHTML),
        parseInt(document.getElementById("binary-value-6").innerHTML),
        parseInt(document.getElementById("binary-value-7").innerHTML),
        parseInt(document.getElementById("binary-value-8").innerHTML),
    ];
    var decimal = 0;
    var N = rule.length
    for (var i = 1; i <= N; i++) {
        var exponent = N - i;
        var operand = Math.pow(2, exponent);
        decimal += rule[i-1]*operand;
    }
    return decimal;
}

function ruleInput() {
    var decimal = document.getElementById("rule-input").value;

    if (decimal == '') {
        var ruleString = document.getElementById('dropdown').value;
        ruleInt = parseInt(ruleString.split('-')[1]);
        thisRule = decimal2rule(ruleInt);
        setAutomatonRule(thisRule);
        var steps = parseInt(document.getElementById('steps').value);
        var cellSize = parseInt(document.getElementById('cell-size').value);   
        drawCellularAutomata(steps, cellSize, thisRule);

        var ruleNumber = rule2decimal();
        document.getElementById('rule-input').value = ruleNumber;       
        setTitle(ruleNumber);
    }
    else {
        thisRule = decimal2rule(decimal);
        setAutomatonRule(thisRule);
        var steps = parseInt(document.getElementById('steps').value);
        var cellSize = parseInt(document.getElementById('cell-size').value);    
        drawCellularAutomata(steps, cellSize, thisRule);
        //document.getElementById('dropdown').value = 'select-rule';        
        var ruleNumber = rule2decimal();
        document.getElementById('rule-input').value = ruleNumber;       
        setTitle(ruleNumber);
    }
}

function decimal2rule(decimal) {
    binary = [];
    while (Math.floor(decimal/2) > 0) {
        divisor = Math.floor(decimal/2);
        remainder = decimal % 2;
        binary.push(remainder);
        decimal = divisor;
    }
    divisor = Math.floor(decimal/2);
    remainder = decimal % 2;
    binary.push(remainder);
    if (binary.length < 8) {
        var diff = 8 - binary.length;
        for (var i = 1; i <= diff; i++) {
            binary.push(0);
        }
        return binary.reverse();
    }
    else {
        return binary.reverse();
    }
  
}

// CELLULAR AUTOMATA
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

function blackCell(i, j, cellSize) {
    ctx.beginPath();
    ctx.fillStyle = "#000000";
    ctx.fillRect(j*cellSize, i*cellSize, cellSize, cellSize);
    ctx.stroke();        
}

function whiteCell(i, j, cellSize) {
    ctx.beginPath();
    //ctx.fillStyle = "#d3d3d3";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(j*cellSize, i*cellSize, cellSize, cellSize);
    ctx.stroke();         
}

// Resize the canvas
function resizeCanvas(rows, cellSize){
    var canvas = document.getElementById("canvas");
    canvas.height = rows*cellSize;
    canvas.width = 2*rows*cellSize;
}

function drawCellularAutomata(rows, cellSize, rule) {
    var startTime = Date.now() / 1000;
    resizeCanvas(rows, cellSize);
    M = rows;
    N = 2*M;

    var blackCellCount = 0;
    var whiteCellCount = 0;

    var patternCount1 = 0;
    var patternCount2 = 0;
    var patternCount3 = 0;
    var patternCount4 = 0;
    var patternCount5 = 0;
    var patternCount6 = 0;
    var patternCount7 = 0;
    var patternCount8 = 0;

    // First row: Full
    row = []
    for (var i = 0; i < N; i++) {row[i] = 0;}
    if (N % 2 == 0) {
        row[N/2] = 1;
    }
    else {
        row[(N+1)/2] = 1;
    }

    for (var j = 0; j < row.length; j++) {
        if (row[j] == 0) {
            whiteCell(0, j, cellSize);
            whiteCellCount += 1;
        }
        else if (row[j] == 1) {
            blackCell(0, j, cellSize);
            blackCellCount += 1;
        }
    }

    // Subsequent rows
    for (var i = 1; i < M; i++) {
        new_row = [];
        for (var j = 1; j < row.length - 1; j++) {
            new_row[0] = 0;
            new_row[N-1] = 0;
            if (row[j-1] == 1 && row[j] == 1 && row[j+1] == 1) {new_row[j] = rule[0]; patternCount1 += 1;}
            else if (row[j-1] == 1 && row[j] == 1 && row[j+1] == 0) {new_row[j] = rule[1]; patternCount2 += 1;}
            else if (row[j-1] == 1 && row[j] == 0 && row[j+1] == 1) {new_row[j] = rule[2]; patternCount3 += 1;}
            else if (row[j-1] == 1 && row[j] == 0 && row[j+1] == 0) {new_row[j] = rule[3]; patternCount4 += 1;}
            else if (row[j-1] == 0 && row[j] == 1 && row[j+1] == 1) {new_row[j] = rule[4]; patternCount5 += 1;}
            else if (row[j-1] == 0 && row[j] == 1 && row[j+1] == 0) {new_row[j] = rule[5]; patternCount6 += 1;}
            else if (row[j-1] == 0 && row[j] == 0 && row[j+1] == 1) {new_row[j] = rule[6]; patternCount7 += 1;}
            else if (row[j-1] == 0 && row[j] == 0 && row[j+1] == 0) {new_row[j] = rule[7]; patternCount8 += 1;}
        }
        
        for (var j = 0; j < row.length; j++) {
            if (new_row[j] == 0) {
                whiteCell(i, j, cellSize);
                whiteCellCount += 1;
            }
            else if (new_row[j] == 1) {
                blackCell(i, j, cellSize);
                blackCellCount += 1;
            }
        }        

        row = new_row;
    }
    var endTime = Date.now() / 1000;
    var duration = Math.round((endTime - startTime)*100) / 100;

    // Horizontal scroll
    $(document).ready(function() {
        var windowWidth = $(window).width();
        var scrollLength = rows*cellSize - windowWidth*0.5;
        $('body, html').scrollLeft(scrollLength);
        $('body, html').scrollTop(0);
    });

    // Rule counts
    document.getElementById("count-value-1").innerHTML = '<div class="outer rule-count-outer"><div class="middle"><div class="inner rule-count-inner">' + formatNumber(patternCount1) + '</div></div></div>';
    document.getElementById("count-value-2").innerHTML = '<div class="outer rule-count-outer"><div class="middle"><div class="inner rule-count-inner">' + formatNumber(patternCount2) + '</div></div></div>';
    document.getElementById("count-value-3").innerHTML = '<div class="outer rule-count-outer"><div class="middle"><div class="inner rule-count-inner">' + formatNumber(patternCount3) + '</div></div></div>';
    document.getElementById("count-value-4").innerHTML = '<div class="outer rule-count-outer"><div class="middle"><div class="inner rule-count-inner">' + formatNumber(patternCount4) + '</div></div></div>';
    document.getElementById("count-value-5").innerHTML = '<div class="outer rule-count-outer"><div class="middle"><div class="inner rule-count-inner">' + formatNumber(patternCount5) + '</div></div></div>';
    document.getElementById("count-value-6").innerHTML = '<div class="outer rule-count-outer"><div class="middle"><div class="inner rule-count-inner">' + formatNumber(patternCount6) + '</div></div></div>';
    document.getElementById("count-value-7").innerHTML = '<div class="outer rule-count-outer"><div class="middle"><div class="inner rule-count-inner">' + formatNumber(patternCount7) + '</div></div></div>';
    document.getElementById("count-value-8").innerHTML = '<div class="outer rule-count-outer"><div class="middle"><div class="inner rule-count-inner">' + formatNumber(patternCount8) + '</div></div></div>';

    // Infobox output
    var totalCellCount = blackCellCount + whiteCellCount;
    document.getElementById("total-cell-count").innerHTML = formatNumber(totalCellCount);
    document.getElementById("black-cell-count").innerHTML = formatNumber(blackCellCount);
    document.getElementById("white-cell-count").innerHTML = formatNumber(whiteCellCount);
    document.getElementById("runtime").innerHTML = duration + ' sec';
    var drawRate = Math.round(totalCellCount / duration);
    document.getElementById("draw-rate").innerHTML = formatNumber(drawRate);
    var blackCellPct = Math.round((blackCellCount / totalCellCount)*100);
    document.getElementById("black-cell-pct").innerHTML = '(' + blackCellPct + '%)';
    var whiteCellPct = Math.round((whiteCellCount / totalCellCount)*100);
    document.getElementById("white-cell-pct").innerHTML = '(' + whiteCellPct + '%)';
}

function formatNumber (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

// Toggle drawing
function toggle(state, config) {
    if (state.className != "white-cell") {
        state.src = 'icons/white_cell.svg';
        state.className = "white-cell";
        id = 'toggle-' + config;
        document.getElementById(id).innerHTML = '<div class="binary" id="binary-value-' + config + '" >0</div></div>';

        toggleRule = [];
        for (var i = 0; i < 8; i++) {
            var order = i + 1;
            newState = parseInt(document.getElementById('binary-value-' + order).innerHTML);
            toggleRule.push(newState);
        }

        setAutomatonRule(toggleRule);
        var steps = parseInt(document.getElementById('steps').value);
        var cellSize = parseInt(document.getElementById('cell-size').value);

        drawCellularAutomata(steps, cellSize, toggleRule);
        //document.getElementById('dropdown').value = 'select-rule';
        var ruleNumber = rule2decimal();
        setTitle(ruleNumber);
        document.getElementById('rule-input').value = ruleNumber;       
    }
    else if(state.className == "white-cell") {
        state.src = 'icons/black_cell.svg';
        state.className = "black-cell";
        id = 'toggle-' + config;
        document.getElementById(id).innerHTML = '<div class="binary binary-black" id="binary-value-' + config + '" >1</div></div>';

        toggleRule = [];
        for (var i = 0; i < 8; i++) {
            var order = i + 1;
            newState = parseInt(document.getElementById('binary-value-' + order).innerHTML);
            toggleRule.push(newState);
        }

        setAutomatonRule(toggleRule);
        var steps = parseInt(document.getElementById('steps').value);
        var cellSize = parseInt(document.getElementById('cell-size').value);
        drawCellularAutomata(steps, cellSize, toggleRule);
        //document.getElementById('dropdown').value = 'select-rule';
        var ruleNumber = rule2decimal();
        setTitle(ruleNumber);
        document.getElementById('rule-input').value = ruleNumber;
    }
    return false;
}

function setTitle(number) {
        var ruleInt = parseInt(number);
        if (ruleInt === 30) {
            var ruleHTML = '<p class="rule-text">Rule<br />' + number + '</p><p class="subtext">(chaotic)</p>';
            document.getElementById('rule-output').innerHTML = ruleHTML;
        }
        else if (ruleInt == 110) {
            var ruleHTML = '<p class="rule-text">Rule<br />' + number + '</p><p class="subtext">(Turing complete)</p>';
            document.getElementById('rule-output').innerHTML = ruleHTML;
        }
        else {
            var ruleHTML = '<p class="rule-text">Rule<br />' + number + '</p>';
            document.getElementById('rule-output').innerHTML = ruleHTML;                
        }
}

// Generate automaton rule
function setAutomatonRule(thisRule) {
    var automatonRuleHTML = '';
    for (var i = 0; i < 8; i++) {
        var currentPatternHTML = '';
        for (var j = 0; j < 3; j++) {
            if (configurations[i][j] == 0) {
                currentPatternHTML += '<img class="cell" src="icons/white_cell.svg" />';
            }
            else if (configurations[i][j] == 1) {
                currentPatternHTML += '<img class="cell" src="icons/black_cell.svg" />';
            }        
        }
        order = i + 1;
        var newStateHTML = '';
        var binaryValueHTML = '';
        if (thisRule[i] == 0) {
            newStateHTML = '<input type="image" src="icons/white_cell.svg" id="white" class="white-cell" onclick="toggle(this, ' + order + ');" />';
            binaryValueHTML = '<div class="split-bottom-outer outer"><div class="middle"><div class="binary-white split-bottom-inner-1 inner"><div id="toggle-' + order + '"><div class="binary" id="binary-value-' + order + '" >0</div></div></div><div class="split-bottom-inner-2 inner"><div id="toggle-' + order + '"><div class="count" id="count-value-' + order + '" ></div></div></div>';
        }
        else if (thisRule[i] == 1) {
            newStateHTML = '<input type="image" src="icons/black_cell.svg" id="black" class="black-cell" onclick="toggle(this, ' + order + ');" />';
            binaryValueHTML = '<div class="split-bottom-outer outer"><div class="middle"><div class="binary-black split-bottom-inner-1 inner"><div id="toggle-' + order + '"><div class="binary" id="binary-value-' + order + '" >1</div></div></div><div class="split-bottom-inner-2 inner"><div id="toggle-' + order + '"><div class="count" id="count-value-' + order + '" ></div></div></div>';
        }
        automatonRuleHTML += '<!-- RULES --><div class="rule-split"><!-- SPLIT TOP --><div class="split-top-outer outer"><div class="middle"><div class="split-top-inner inner"><div>' + currentPatternHTML + '</div><div><img class="cell" src="icons/empty_cell.svg" />' + newStateHTML + '<img class="cell" src="icons/empty_cell.svg" /></div></div></div></div><!-- SPLIT BOTTOM -->' + binaryValueHTML + '</div></div></div></div>';

    }
    document.getElementById('automaton-rule').innerHTML = automatonRuleHTML;
}

// Automaton rule patterns
configurations = [[1,1,1], [1,1,0], [1,0,1], [1,0,0], [0,1,1], [0,1,0], [0,0,1], [0,0,0]];

// Initial drawing
var rule30 = [0, 0, 0, 1, 1, 1, 1, 0]; 
var thisRule = rule30;
setAutomatonRule(thisRule);

var windowWidth = $(window).width();
var cellSize = 10;
var rows = Math.floor(windowWidth / (2*cellSize));

document.getElementById('rule-input').value = 30;
document.getElementById('steps').value = rows;
document.getElementById('cell-size').value = cellSize;

drawCellularAutomata(rows, cellSize, thisRule);
setTitle('30');
