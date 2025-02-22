/*
    GameBoard
        initialize
            empty the board
        getSquare
        setSquare
    Player
        selectSquare
    Game
        initialize
            set player name
            set player symbol
        changeTurn
        end
        restart
*/

const gameBoard = (function () {
    const board = [["", "", ""], ["", "", ""], ["", "", ""]];

    const initializeBoard = () => {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                board[i][j] = "";
            }
        }
    }

    const getBoard = () => board;

    const getSquare = (row, column) => board[row][column];

    const setSquare = (row, column, symbol) => {
        board[row][column] = symbol;
    };

    return { initializeBoard, getBoard, getSquare, setSquare };
})();

function createPlayer(name, symbol) {

    const getName = () => name;

    const getSymbol = () => symbol;

    const selectSquare = (row, column) => {
        gameBoard.setSquare(row, column, symbol);
    }

    return { getName, getSymbol, selectSquare };
}