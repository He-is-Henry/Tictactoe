currentPlayer = "X"; // Reset starting player
const multiPlayerButton = document.querySelector(".multi-player");
const singlePlayerButton = document.querySelector(".single-player");
const overlay = document.querySelector(".overlay");
const heading = document.querySelector(".heading");
const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const cellsArray = Array.from(cells);
const message = document.getElementById("message");
const wrapper = document.querySelector(".wrapper");
const playAgain = document.querySelector(".play-again");
let isSinglePlayer = false;
// Define winning combinations for Tic Tac Toe
const winningConditions = [
    [0, 1, 2], // Row 1
    [3, 4, 5], // Row 2
    [6, 7, 8], // Row 3
    [0, 3, 6], // Column 1
    [1, 4, 7], // Column 2
    [2, 5, 8], // Column 3
    [0, 4, 8], // Diagonal
    [2, 4, 6] // Diagonal
];
function getComputerChoice() {
    let move;
    move = canBlock("X");
    if (move !== null) {
        cellsArray[move].textContent = "O";
        cellsArray[move].classList.add("o");
        updateHeading();
        currentPlayer = "X";
        checkStatus();
        return;
    }
    let attempts = 0;
    let randomCell;
    while (attempts < 10) {
        randomCell = Math.floor(Math.random() * 9);
        if (cellsArray[randomCell].textContent === "") {
            cellsArray[randomCell].textContent = "O";
            console.log("Computer move: 0");
            cellsArray[randomCell].classList.add("o");
            currentPlayer = "X";
            updateHeading();
            checkStatus();
            break;
        }
        attempts++;
    }
}

function resetGame() {
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("x", "o");
        cell.classList.remove("winner");
        updateHeading();
        currentPlayer = "X";
        wrapper.classList.remove("show"); // Hide the wrapper
        message.textContent = ""; // Clear the
    });
}
function disableClicks() {
    cells.forEach(cell => cell.removeEventListener("click", handleClick)); // Remove event listeners
    setTimeout(() => {
        cells.forEach(cell => cell.addEventListener("click", handleClick)); // Re-enable event listeners after delay
    }, 200);
}
function checkWinner() {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        const cellA = cells[a].textContent;
        const cellB = cells[b].textContent;
        const cellC = cells[c].textContent;
        if (!cellA || !cellB || !cellC) continue;
        if (cellA === cellB && cellA === cellC) {
            cells[a].classList.add("winner");
            cells[b].classList.add("winner");
            cells[c].classList.add("winner");
            return cellA;
        }
    }
    return null;
}

function checkTie() {
    const winner = checkWinner();
    // Check if all cells are filled
    if (!winner) {
        return Array.from(cells).every(cell => cell.textContent !== "");
    }
}
function handleClick(event) {
    const clickedCell = event.target;
    if (clickedCell.textContent !== "") return;

    if (currentPlayer === "X") {
        clickedCell.textContent = "X";
        clickedCell.classList.add("x");
        currentPlayer = "O";
    } else if (!isSinglePlayer && currentPlayer === "O") {
        clickedCell.textContent = "O";
        clickedCell.classList.add("o");
        currentPlayer = "X";
    }
    disableClicks();
    updateHeading();
    checkStatus();
    const winner = checkWinner();
    if (isSinglePlayer && currentPlayer === "O" && !winner) {
        setTimeout(getComputerChoice, 500);
    }
}

function updateHeading() {
    heading.textContent = `Player ${currentPlayer}'s  turn `;
}

playAgain.addEventListener("click", resetGame);
function startMultiplayerMode() {
    resetGame();
    updateHeading();
    overlay.style.display = "none";

    cells.forEach(cell => {
        cell.addEventListener("click", handleClick); // Attach click event to each cell
    });
}

singlePlayerButton.addEventListener("click", startSinglePlayer);
multiPlayerButton.addEventListener("click", startMultiplayerMode);

function startSinglePlayer() {
    isSinglePlayer = true;
    resetGame();
    overlay.style.display = "none";

    cells.forEach(cell => {
        cell.addEventListener("click", handleClick); // Attach click event to each cell
    });
}

document.querySelector(".home-button").addEventListener("click", () => {
    overlay.style.display = "flex";
    heading.innerHTML = "Tic Tac Toe";
    isSinglePlayer = false;
});

function canBlock(player) {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        const cellsContent = [
            cellsArray[a].textContent,
            cellsArray[b].textContent,
            cellsArray[c].textContent
        ];
        if (
            cellsContent.filter(cell => cell === player).length === 2 &&
            cellsContent.includes("")
        ) {
            return condition[cellsContent.indexOf("")];
        }
    }
    return null;
}

function checkStatus() {
    const tie = checkTie();
    if (tie) {
        setTimeout(function () {
            wrapper.classList.add("show");
            message.textContent = `It's a tie`;
        }, 1000);
    }
    const winner = checkWinner();
    if (winner) {
        console.log(`${winner} is the winner`);
        setTimeout(function () {
            wrapper.classList.add("show");
            message.textContent = `Player ${winner} wins`;
        }, 1000);
    }
}
