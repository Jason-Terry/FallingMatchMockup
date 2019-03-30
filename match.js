const chalk = require('chalk');
const SLEEP = 400;

// Emjoi Types, 'H', 'S", 'A", '-', 'X',
var Emoji = function (type, active = true) {
    return {
        "type": type,
        "worry": false,
        "active": active
    };
}

var sleep = function (milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

var prepare = function () {
    var board = [
        [],
        [],
        [],
        [],
        []
    ];
    board[0][0] = Emoji('-', false);
    board[0][1] = Emoji('-', false);
    board[0][2] = Emoji('-', false);
    board[0][3] = Emoji('-', false);
    board[0][4] = Emoji('-', false);

    board[1][0] = Emoji('-', false);
    board[1][1] = Emoji('H');
    board[1][2] = Emoji('H');
    board[1][3] = Emoji('S');
    board[1][4] = Emoji('-', false);

    board[2][0] = Emoji('-', false);
    board[2][1] = Emoji('S');
    board[2][2] = Emoji('H');
    board[2][3] = Emoji('H');
    board[2][4] = Emoji('-', false);

    board[3][0] = Emoji('-', false);
    board[3][1] = Emoji('H');
    board[3][2] = Emoji('H');
    board[3][3] = Emoji('A');
    board[3][4] = Emoji('-', false);

    board[4][0] = Emoji('-', false);
    board[4][1] = Emoji('-', false);
    board[4][2] = Emoji('-', false);
    board[4][3] = Emoji('-', false);
    board[4][4] = Emoji('-', false);

    return board;
}

var output = function (board) {
    sleep(SLEEP)
    let line = "";
    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board[x].length; y++) {
            const e = board[x][y];
            line += "|";
            if (x == selection.x && y == selection.y) {
                line += chalk.red(e.type);
            } else if (e.worry) {
                line += chalk.green(e.type);
            } else {
                line += e.type;
            }
            line += "|";
        }
        console.log(line);
        line = "";
    }
}

var prompt = function (msg) {
    sleep(SLEEP);
    console.log(msg);
}

var check = function (x, y, board) {
    // check east
    if (board[x][y].type == board[x][y + 1].type) {
        board[x][y].worry = true;
        if (!board[x][y + 1].worry) {
            board[x][y + 1].worry = true;
            check(x, y + 1, board);
        }


    }

    // check south
    if (board[x][y].type == board[x + 1][y].type) {
        board[x][y].worry = true;
        if (!board[x + 1][y].worry) {
            board[x + 1][y].worry = true;
            check(x + 1, y, board);
        }
    }

    // check west
    if (board[x][y].type == board[x][y - 1].type) {
        board[x][y].worry = true;
        if (!board[x][y - 1].worry) {
            board[x][y - 1].worry = true;
            check(x, y - 1, board);
        }
    }

    // check north
    if (board[x][y].type == board[x - 1][y].type) {
        board[x][y].worry = true;
        if (!board[x - 1][y].worry) {
            board[x - 1][y].worry = true;
            check(x - 1, y, board);
        }
    }
}

var pop = function (board) {
    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board.length; y++) {
            const e = board[x][y];
            // if worry, pop!
            if (e.worry) {
                e.type = 'X';
                e.worry = false;
            }
        }
    }
}

var shift = function (board) {
    for (let x = board.length - 1; x >= 0; x--) {
        for (let y = board[x].length - 1; y >= 0; y--) {
            const e = board[x][y];
            // IF POP, and can move down, move down until can't
            if (e.active && e.type == 'X') {
                // calc fall
                let full = false;
                let n = 0;
                while (!full) {
                    // if we find a non X active tile, pull it down
                    if (x - n < 0) {
                        full = true;
                    } else if (board[x - n][y].active && board[x - n][y].type != 'X') {
                        e.type = board[x - n][y].type;
                        board[x - n][y].type = 'X';
                        full = true;
                    } else {
                        n++;
                    }
                }
            }
        }
    }
}

var random = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 

}

var fill = function (board) {
    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board.length; y++) {
            const e = board[x][y];
            // if 'X' make new!
            if (e.type == 'X') {
                let r = random(1, 3);
                switch (r) {
                    case 1:
                        e.type = 'A';
                        break;
                    case 2:
                        e.type = 'S';
                        break;
                    case 3:
                        e.type = 'H';
                        break;
                    default:
                        e.type = 'X';
                        break;
                }
            }
        }
    }
}

// BUILD BOARD AND SET SELECTION
let board = prepare();
let selection = {
    "x": 1,
    "y": 2
} // MIDDLE RIGHT


// PROMPT AND OUTPUT TEST BOARD
prompt(chalk.bold("FOR GIVEN BOARD, SELECTING TILE AT {X:" + selection.x + ", Y:" + selection.y + "}"));
output(board);

// CALL CHECK
prompt(chalk.bold("MATCH FOUND!"));
check(selection.x, selection.y, board);
output(board);

// POP
prompt(chalk.bold("POPPING MATCH!"));
pop(board);
output(board);

// SHIFT
prompt(chalk.bold("SHIFTING REMAINING TILES!"))
shift(board);
output(board);

// FILL
fill(board)

// PRINT UPDATE
prompt(chalk.bold("FINAL BOARD STATE!"));
output(board);