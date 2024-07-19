const gameBoard = document.getElementById('gameBoard');
const cells = Array.from(document.getElementsByClassName('cell'));
const result = document.getElementById('result');
const resetButton = document.getElementById('resetButton');
let currentPlayer = 'X';
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetBoard);

function handleCellClick(e) {
    const cell = e.target;
    const index = cells.indexOf(cell);

    if (cell.textContent === '' && currentPlayer === 'X') {
        makeMove(index, 'X');
        if (!checkWin('X') && !isBoardFull()) {
            setTimeout(makeAiMove, 500);
        }
    }
}

function makeMove(index, player) {
    cells[index].textContent = player;
    cells[index].classList.add(player);
    if (checkWin(player)) {
        setTimeout(() => displayResult(`${player} wins!`), 100);
    } else if (isBoardFull()) {
        setTimeout(() => displayResult(`It's a draw!`), 100);
    }
}

function isBoardFull() {
    return cells.every(cell => cell.textContent !== '');
}

function resetBoard() {
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('X', 'O');
    });
    result.textContent = '';
    currentPlayer = 'X';
}

function displayResult(message) {
    result.textContent = message;
    cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
}

function checkWin(player) {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return cells[index].textContent === player;
        });
    });
}

function makeAiMove() {
    const bestMove = findBestMove();
    makeMove(bestMove, 'O');
    currentPlayer = 'X';
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
}

function findBestMove() {
    let bestScore = -Infinity;
    let move = 0;

    for (let i = 0; i < cells.length; i++) {
        if (cells[i].textContent === '') {
            cells[i].textContent = 'O';
            let score = minimax(false);
            cells[i].textContent = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(isMaximizing) {
    if (checkWin('O')) return 1;
    if (checkWin('X')) return -1;
    if (isBoardFull()) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].textContent === '') {
                cells[i].textContent = 'O';
                let score = minimax(false);
                cells[i].textContent = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].textContent === '') {
                cells[i].textContent = 'X';
                let score = minimax(true);
                cells[i].textContent = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}
