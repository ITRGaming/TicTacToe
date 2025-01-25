import React, {useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import Logout from './Logout';
import '../App.css';
import Play from './Play';

const Profile = () => {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [newName, setNewName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate(); 
    
    useEffect(() => {
        const fetchUser = async () => { 
        if (token != null) {
            try {
                const user = await api.fetchProfile(token);
                if (user){
                    localStorage.setItem('id', user.id);
                    setUsername(user.username);
                    setName(user.name);
                    setSuccess('User data fetched successfully'); 
                }
            } catch (error) {
                setError('Failed to fetch user data');
            }
        }
        };

        fetchUser();
    }, [token]);

    useEffect(() => {
        if (error || success) {
            const timeout = setTimeout(() => {
                setError(null);
                setSuccess(null);
            }, 4000);
            return () => clearTimeout(timeout);
        }
    }, [error, success]);

    const handleUpdateName = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await api.update(username, newName, token);
            setSuccess('Profile updated successfully');
        } catch (error) {
            setError('Failed to update profile');
        } finally {
            setIsLoading(false);
            window.location.reload();
        }
    };


    // const handleGame = async() => {
    //     let gameId;
    //     try{
    //         setFindGame('Finding game...');
    //         setIsFinding(true);
    //         const game = await api.findGame(id);
    //         gameId = game.id;
    //         localStorage.setItem('gameId', gameId);
    //         localStorage.setItem('X', game.player1Id);
    //         localStorage.setItem('O', game.player2Id);
    //     } catch (error) {
    //         console.error(error.response.data.error);
    //     } finally {
    //         if(gameId){
    //             setFindGame(`Game found! Redirecting to game ${gameId}`);
    //             setTimeout(() => {
    //                 setFindGame(null);
    //                 setIsFinding(false);
    //                 navigate(`/game/${gameId}`);
    //             }, 3000);
    //         }
    //     }
    // }

    return (
        <div>
            <div>
                <div>
                    {error && <p className='error'>{error}</p>}
                    {success && <p className='succes'>{success}</p>}
                    {/* {findGame && <p className='findGame'>{findGame}</p>} */}

                </div>
                <div>
                    <h1>Profile</h1>
                    <p>Username: {username}</p>
                    <p>Name: {name}</p>
                    <form onSubmit={handleUpdateName}>
                        <label>
                            Update name:
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                        </label>
                        <button type="submit" disabled={isLoading}>
                            Update
                        </button>
                    
                    </form>
                </div>
            </div>
                <div>
                    <Logout />
                    <br/>
                    <Play/>
                </div>
        </div>
    );
};

export default Profile;