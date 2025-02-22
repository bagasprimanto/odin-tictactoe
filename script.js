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

    const getBoard = () => board;

    const getSquare = (row, column) => board[row][column];

    const setSquare = (row, column, symbol) => {
        board[row][column] = symbol;
    };

    return { getBoard, getSquare, setSquare };
})();

function createPlayer(name, symbol) {

    const getName = function () {
        return name;
    }

    const getSymbol = function () {
        return symbol;
    }

    const selectSquare = function (row, column) {
        gameBoard.setSquare(row, column, symbol);
    }

    return { getName, getSymbol, selectSquare };
}