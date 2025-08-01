import { useState } from "react";

function Square({ value, onSquareClick }) {
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}

function Board({ xIsNext, squares, onPlay }) {
    function handleClick(i) {
        if (squares[i] || calculateWinner(squares)) return;
        const nextSquares = squares.slice();
        nextSquares[i] = xIsNext ? "X" : "O";
        onPlay(nextSquares);
    }

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = "Winner: " + winner;
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    const squareLines = [];
    for (let i1 = 0; i1 < 3; i1++) {
        const squareLineItems = [];
        for (let i2 = 0; i2 < 3; i2++) {
            const squareIndex = i1 * 3 + i2;
            squareLineItems.push(
                <Square
                    value={squares[squareIndex]}
                    onSquareClick={() => handleClick(squareIndex)}
                    key={squareIndex}
                />
            );
        }
        squareLines.push(
            <div className="board-row" key={i1}>
                {squareLineItems}
            </div>
        );
    }

    return (
        <>
            <div className="status">{status}</div>
            {squareLines}
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const currentSquares = history[currentMove];
    const xIsNext = currentMove % 2 === 0;

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((_, move) => {
        const description = move > 0 ? "move #" + move : "game start";
        return move === currentMove ? (
            <li key={move}>
                <span>You're at {description}</span>
            </li>
        ) : (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>
                    Go to {description}
                </button>
            </li>
        );
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    xIsNext={xIsNext}
                    squares={currentSquares}
                    onPlay={handlePlay}
                />
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    const winnerLine = lines.find(
        ([a, b, c]) =>
            squares[a] && squares[a] === squares[b] && squares[a] === squares[c]
    );
    return winnerLine ? squares[winnerLine[0]] : null;
}
