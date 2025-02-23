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
            board[i].push(createSquare());
        }
    }

    const resetBoard = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                board[i][j] = createSquare();
            }
        }
    }

    const getBoard = () => board;

    const getSquare = (row, column) => board[row][column];

    const occupySquare = (row, column, player) => {
        board[row][column].setOccupant(player);
    };

    const displayBoard = () => {
        let boardDisplay = ""
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                boardDisplay += "[" + board[i][j].getSymbol() + "]";
            }
            boardDisplay += "\n";
        }

        console.log(boardDisplay);
    }

    const _checkDirection = (startI, startJ, deltaI, deltaJ) => {
        let winner = null;

        let i = startI;
        let j = startJ;

        if (board[i][j].getOccupant()) {
            let currentOccupant = board[i][j].getOccupant();
            while (i >= 0 && i < rows && j >= 0 && j < columns) {
                if (board[i][j].getOccupant() !== currentOccupant) {
                    break; // Mismatch, stop checking
                }
                i += deltaI;
                j += deltaJ;
            }

            // Check if we went to the end of the row/column/diagonal
            if (i === (startI + deltaI * rows) && j === (startJ + deltaJ * columns)) {
                winner = currentOccupant;
            }
        }
        return winner;
    }

    const _getWinnerRows = () => {
        for (let i = 0; i < rows; i++) {
            const result = _checkDirection(i, 0, 0, 1);
            if (result) return result;
        }
        return null;
    }

    const _getWinnerColumns = () => {
        for (let j = 0; j < columns; j++) {
            const result = _checkDirection(0, j, 1, 0);
            if (result) return result;
        }
        return null;
    }

    const _getWinnerDiagonals = () => {
        // First diagonal
        let result = _checkDirection(0, 0, 1, 1);
        if (result) return result;

        // Second diagonal
        result = _checkDirection(rows - 1, 0, -1, 1);
        return result;
    }

    const getWinner = () => {
        return _getWinnerRows() || _getWinnerColumns() || _getWinnerDiagonals();
    }

    const isAvailableSquare = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (board[i][j].getSymbol() === "") return true; // True if there is an empty square
            }
        }

        return false; // False is no empty squares
    }

    return { resetBoard, getBoard, getSquare, occupySquare, displayBoard, getWinner, isAvailableSquare };
}

function createSquare() {
    let occupant = null;

    const getSymbol = () => {
        return occupant ? occupant.getSymbol() : "";
    };

    const setOccupant = (selOccupant) => {
        occupant = selOccupant;
    }

    const getOccupant = () => occupant;

    return { getSymbol, setOccupant, getOccupant };
}

function createPlayer(name, symbol) {

    const getName = () => name;

    const getSymbol = () => symbol;

    return { getName, getSymbol };
}

const game = (function (selPlayer1 = "Player 1", selPlayer2 = "Player 2") {

    const players = [];
    const board = gameBoard();
    let winner = null;
    let isPlay = true;

    const player1 = createPlayer(selPlayer1, "O");
    const player2 = createPlayer(selPlayer2, "X");
    players.push(player1, player2);

    let currentPlayer = players[0];

    const getCurrentPlayer = () => currentPlayer;

    const changeTurn = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    }

    const playRound = (row, column) => {
        if (isPlay) {
            console.log(`${getCurrentPlayer().getName()} selects cell (${row}, ${column})`)
            board.occupySquare(row, column, getCurrentPlayer());

            if (evaluate()) {
                changeTurn();
                displayNewRound();
            } else {
                announceResult();
            }
        } else {
            console.log("Cannot continue playing.");
        }
    }

    const evaluate = () => {
        // Board Check winner
        winner = board.getWinner();
        // Any winner ?
        // If winner -> end (announce winner, end)
        if (winner || !board.isAvailableSquare()) {
            isPlay = false;
            return false;
        }
        // If no winner -> // Check if there are still available squares
        // No available squares -> (announce draw, end)
        // Still available squares -> playRound
        return true;
    }

    const announceResult = () => {
        if (winner) {
            console.log(`The winner is ${winner.getName()}.`);
        } else {
            console.log(`It's a draw!`);
        }

        console.log("Game has ended.");
    }

    const displayNewRound = () => {
        board.displayBoard();
        console.log(`Current player: ${getCurrentPlayer().getName()}`);
    }

    displayNewRound();

    return { playRound, displayNewRound, getCurrentPlayer, evaluate };

})();