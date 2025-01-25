import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import '../App.css';

const Play = ({onGameStart}) => {

    const [findGame, setFindGame] = useState(null);
    const [isFinding, setIsFinding] = useState(false);

    const id = localStorage.getItem('id');

    const navigate = useNavigate(); 


    const handleGame = async() => {
            localStorage.removeItem('gameId');
            localStorage.removeItem('X');
            localStorage.removeItem('O');
            localStorage.removeItem('gameInProgress');
            let gameId;
            try{
                setFindGame('Finding game...');
                setIsFinding(true);
                const game = await api.findGame(id);
                gameId = game.id;
                localStorage.setItem('gameId', gameId);
                localStorage.setItem('X', game.player1Id);
                localStorage.setItem('O', game.player2Id);
                if (onGameStart) onGameStart(gameId);
            } catch (error) {
                console.error(error.response.data.error);
            } finally {
                if(gameId){
                    setFindGame(`Game found! Redirecting to game ${gameId}`);
                    setTimeout(() => {
                        setFindGame(null);
                        setIsFinding(false);
                        navigate(`/game/${gameId}`);
                    }, 3000);
                }
            }
        }
    return (
        <div>
            <button onClick={handleGame}>Find New Game</button>
            {isFinding && <p className="findGame">{findGame}</p>}
        </div>
    );
};

export default Play;