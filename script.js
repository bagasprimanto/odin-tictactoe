/*
Overall tic tac toe design:
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
        restart
        announceResult
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

        return false; // False if no empty squares
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

function createGame(selPlayer1 = "Player 1", selPlayer2 = "Player 2") {

    const players = [];
    const board = gameBoard();
    let winner = null;
    let isPlay = true;

    const player1 = createPlayer(selPlayer1, "O");
    const player2 = createPlayer(selPlayer2, "X");
    players.push(player1, player2);

    let currentPlayer = players[0];

    const getCurrentPlayer = () => currentPlayer;

    const getBoard = () => board.getBoard();

    const getIsPlay = () => isPlay;

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
        // If winner or no squares are available -> end (isPlay = false to stop playing) & return false
        if (winner || !board.isAvailableSquare()) {
            isPlay = false;
            return false;
        }
        // else, continue by returning true
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

    const restart = () => {
        isPlay = true;
        currentPlayer = players[0];
        board.resetBoard();
        displayNewRound();
    }

    const displayNewRound = () => {
        board.displayBoard();
        console.log(`Current player: ${getCurrentPlayer().getName()}`);
    }

    displayNewRound();

    return { playRound, getCurrentPlayer, restart, getBoard, getIsPlay };

}

const displayController = (function () {
    const game = createGame();
    const turnDiv = document.querySelector(".current-player");
    const playerSpan = document.querySelector(".player");
    const boardDiv = document.querySelector(".board");

    const updateDisplay = () => {
        //Clear the board
        boardDiv.textContent = "";

        // Get the newest version of the board and player turn
        const board = game.getBoard();

        // Display the state of the board
        board.forEach((row, rowIndex) => {
            row.forEach((square, colIndex) => {
                const squareButton = document.createElement("button");
                squareButton.classList.add("square");
                const squareIndex = `${rowIndex}${colIndex}`;
                squareButton.setAttribute("data-attribute", squareIndex);
                squareButton.textContent = square.getSymbol();
                boardDiv.appendChild(squareButton);
            })
        })

        // Display the current player
        if (game.getIsPlay()) {
            playerSpan.textContent = game.getCurrentPlayer().getName();
        } else {
            turnDiv.textContent = `${game.getCurrentPlayer().getName()} wins! Game has ended.`
        }
    }

    const clickHandler = (event) => {
        const selectedSquareIndex = event.target.getAttribute("data-attribute");

        if (!selectedSquareIndex) return;

        const rowIndex = selectedSquareIndex.charAt(0);
        const colIndex = selectedSquareIndex.charAt(1);

        game.playRound(rowIndex, colIndex);
        updateDisplay();
    }

    boardDiv.addEventListener("click", clickHandler);

    updateDisplay();

    return { updateDisplay };
})()