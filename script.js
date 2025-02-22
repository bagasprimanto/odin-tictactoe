/*
    GameBoard
        state:
            board
        initialize
            empty the board
        getSquare
        setSquare
    Player
        selectSquare
    Game
        state:
            players
            board
            currentPlayer
            isPlay
        methods:
        initialize
            set player name
            set player symbol
        changeTurn
        end
        restart
*/

const gameBoard = function () {
    const rows = 3;
    const columns = 3;
    const board = []

    for (let i = 0; i < rows; i++) {
        board.push([]);
    }

    for (let i = 0; i < rows; i++) {
        for (let j = board[i].length; j < columns; j++) {
            board[i].push("");
        }
    }

    const resetBoard = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                board[i][j] = "";
            }
        }
    }

    const getBoard = () => board;

    const getSquare = (row, column) => board[row][column];

    const occupySquare = (row, column, symbol) => {
        board[row][column] = symbol;
    };

    const displayBoard = () => {
        let boardDisplay = ""
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                boardDisplay += "[" + board[i][j] + "]";
            }
            boardDisplay += "\n";
        }

        console.log(boardDisplay);
    }

    return { resetBoard, getBoard, getSquare, occupySquare, displayBoard };
}

function createPlayer(name, symbol) {
    const getName = () => name;

    const getSymbol = () => symbol;

    return { getName, getSymbol };
}

const game = (function (selPlayer1 = "Player 1", selPlayer2 = "Player 2") {

    const players = [];
    const board = gameBoard();

    const player1 = createPlayer(selPlayer1, "O");
    const player2 = createPlayer(selPlayer2, "X");
    players.push(player1, player2);

    let currentPlayer = players[0];

    const getCurrentPlayer = () => currentPlayer;

    const changeTurn = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    }

    const playRound = (row, column) => {
        console.log(`${getCurrentPlayer().getName()} selects cell (${row}, ${column})`)
        board.occupySquare(row, column, getCurrentPlayer().getSymbol());

        changeTurn();
        displayNewRound();
    }

    const displayNewRound = () => {
        board.displayBoard();
        console.log(`Current player: ${getCurrentPlayer().getName()}`);
    }

    displayNewRound();

    return { playRound, displayNewRound, getCurrentPlayer };

})();