


async function checkRow(board){
    for (var i = 0; i < 3; i++){
        let j = i * 3;
        if (board[j] == board[j + 1] && board[j + 1] == board[j + 2] && board[j] != null && board[j] != ""){
            return {winner: board[j], type: "row", index: j+1};
        }
    }
    return null;
}
// [0, 1, 2]
// [3, 4, 5] => [0, 1, 2, 3, 4, 5, 6, 7, 8]
// [6, 7, 8]

async function checkColumn(board){
    for (var i = 0; i < 3; i++){
        if (board[i] == board[i + 3] && board[i + 3] == board[i + 6] && board[i] != null && board[i] != ""){
            return {winner: board[i], type: "column", index: i+1};
        }
    }
    return null;
}

// [0, 1, 2]
// [3, 4, 5] => [0, 1, 2, 3, 4, 5, 6, 7, 8]
// [6, 7, 8]

async function checkDiagonal(board){
    if (board[0] == board[4] && board[4] == board[8] && board[0] != null && board[0] != ""){
        return {winner: board[0], type: "diagonal", index: 1};
    }else if (board[2] == board[4] && board[4] == board[6] && board[2] != null && board[2] != ""){
        return {winner: board[2], type: "diagonal", index: 2};
    }else {
        return null;
    }
}

export async function checkWinner(board){
    const isBoardFilled = board.every(cell => cell !== null && cell !== "");
    // console.log(isBoardFilled, board);
    let row = await checkRow(board);
    let column = await checkColumn(board);
    let diagonal = await checkDiagonal(board);
    
    if (row != null){
        return row;
    }else if (column != null){
        return column;
    }else if (diagonal != null){
        return diagonal;
    }else if (isBoardFilled){
        return {winner: null, type: "draw", index: null};
    }else {
        return null;
    }
    
}

// const board = ["O", "X", "X", 
                // "O", "O", "X", 
                // "X", "O", "O"]; //test board
// console.log(checkWinner(board)); //should return {winner: "O", type: "diagonal", index: 1}

// module.exports = {checkWinner};