import React, { useState, useEffect } from 'react';
import api from '../api/api';
import Play from './Play';
import '../App.css';


const Game = () => {

    const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [symbol, setSymbol] = useState(null);
    const [opponent, setOpponent] = useState(null);
    const [progress, setProgress] = useState(false);
    const [turn, setTurn] = useState(null);
    const [winner, setWinner] = useState(null);
    const [play, setPlay] = useState(false);
    const [type, setType] = useState(null);
    const [num, setNum] = useState(null);
    
    const playerId = Number(localStorage.getItem('id'));
    // console.log({'Player ': playerId});
    const gameId = localStorage.getItem('gameId');

    useEffect(() => {
        if (!play){
            fetchGameData();
            const gameInProgress = localStorage.getItem('gameInProgress');
            setProgress(gameInProgress);
            if (!progress) {
                localStorage.setItem('gameInProgress', true);
                const firstPlayer = Number(localStorage.getItem('X'));
                const secondPlayer = Number(localStorage.getItem('O'));
                if (firstPlayer === playerId) {
                    setSymbol('X');
                    setTurn('Your turn');
                    setOpponent(secondPlayer);
                }else {
                    setSymbol('O');
                    setOpponent(firstPlayer);
                    setTurn("Opponent's turn");
                }
            }
        }
    }, [progress, playerId, play]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchGameData();
            
        }, 2000);

        return () => clearInterval(interval);
    }, [currentPlayer, playerId, winner]);

    const restGameState = () => {
        setBoard(["", "", "", "", "", "", "", "", ""]);
        setWinner(null);
        setTurn(null);
        setProgress(false);
        setPlay(false);
        setOpponent(null);
        setSymbol(null);
        setCurrentPlayer(null);
        setType(null);
        setNum(null);
        window.location.reload();
    };

    const handleNewGame = (newGameId) => {
        localStorage.setItem('gameId', newGameId);
        restGameState();
        fetchGameData();
    };

    const fetchGameData = async() => {
        try {
            const game = await api.fetchGame(gameId);
            // console.log({'Game Details': game.current_turn});
            setCurrentPlayer(game.current_turn);
            setTurn(currentPlayer !== playerId ? "Opponent's turn" : 'Your turn');
            setBoard(JSON.parse(game.board));
            
            // console.log(game);
                if (game.type !== "" && game.type !== null) {
                    setType(game.type);
                    setNum(game.index_id);
                    setPlay(true);
                    // setBoard(["", "", "", "", "", "", "", "", ""]);
                    if (game.type === 'draw') {
                        setTurn('Game Over! It is a draw');
                    }else{
                        if (game.winner_id === playerId) {
                            setWinner(playerId);
                            setTurn('Game Over! You win');
                        }else {
                            setWinner(opponent);
                            setTurn('Game Over! You lose');
                        }
                    }
                }
            // console.log({'Board': board});
        }catch(error){
            console.error(error.response.data.error);
        }
    };

    const tictactoe = async (index) => {
        // console.log(index);
        if (currentPlayer === playerId && winner === null) {   
            // console.log('Your turn'); 
            let newBoard = [...board];
            // console.log(newBoard);
            if (newBoard[index] === "") {
                newBoard[index] = symbol;
                setBoard(newBoard);
                // console.log(newBoard);
                setCurrentPlayer(opponent);
                const gameMove = await api.playMove(gameId, newBoard, Number(opponent), Number(playerId));
                if (gameMove.type){                   
                    setType(gameMove.type);
                    setNum(gameMove.index);
                    if (gameMove.type === 'draw') {
                        setTurn('Game Over! It is a draw');
                    }else{    
                        if (gameMove.winner === symbol) {
                            setWinner(playerId);
                            setTurn('Game Over! You win');
                        }else {
                            setWinner(opponent);
                            setTurn('Game Over! You lose');
                        }
                    }
                }
                

            }else if (winner === null) {
                setTurn('Wrong Move');
            }else {
                setTurn('Game Over winner is: '+ winner);
            }
            
        } else {
            setTurn('Not your turn');
            console.log('Not your turn');
        }
    }

    return (
        <div>
            <h1>Tic Tac Toe</h1>
            {turn && <h2>{turn}</h2>}
            <div className='tictactoe'>
            {board.map((cell, index) => (
                    <button
                        key={index}
                        className="btn"
                        id={`btn${index}`}
                        onClick={() => tictactoe(index)}
                    >
                        {cell}
                    </button>
                ))}
            </div>
            {play && <Play onGameStart = {handleNewGame}/>}

        </div>
    );
};

export default Game;