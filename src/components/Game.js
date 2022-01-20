import React, { useState, useEffect } from 'react';
import './Game.css';
import tunaudio from '../audio/Mclick1.mp3'
import wonaudio from '../audio/wonSound.wav'
import ReplayIcon from '@mui/icons-material/Replay';
import CloseIcon from '@mui/icons-material/Close';

const Game = ({ setIsStart, socket }) => {
    const [won, setWon] = useState(null)
    const [you, setData] = useState(null)
    const [showRoomid, setRoomid] = useState(null)
    const [whoesTurn, setwhoesturn] = useState(null)

    // imported sounds
    let tunSound = new Audio(`${tunaudio}`)
    let wonSound = new Audio(`${wonaudio}`)


    // play game
    const show = (e) => {
        socket.emit("moveState", { 'index': e.target.value, 'roomId': showRoomid, 'playerWhoMoved': socket.id })
    }

    // restart game
    const restartGame = () => {
        const ran = Math.floor(Math.random() * 2)
        socket.emit("resetBoard", { 'roomId': showRoomid, 'ran': ran })
    }

    // quit game
    const quit = () => {
        socket.emit("leavePlayer", { 'roomId': showRoomid })
        setIsStart(false)
    }

    // check winner 
    const checkWinner = () => {
        let btns = document.querySelectorAll('.box')
        const winningPos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        for (let i = 0; i < winningPos.length; i++) {
            const [a, b, c] = winningPos[i]
            if (btns[a].innerText && btns[a].innerText === btns[b].innerText && btns[b].innerText === btns[c].innerText) {
                wonSound.play()
                socket.emit("checkWinnerClient", { 'roomId': showRoomid, 'wonSymbol': btns[a].innerText })
                return btns[a].innerText
            }
        }
        return null
    }

    const checkDraw = () => {
        let btns = document.querySelectorAll('.box')

        let d = 0;
        for (let i = 0; i < btns.length; i++) {
            if (btns[i].innerText === 'X' || btns[i].innerText === 'O') {
                d = d + 1
            }
        }
        if (d === 9) {
            wonSound.play()
            socket.emit("checkDrawClient", { 'roomId': showRoomid })
            return "Draw"
        }

    }


    // check players 
    useEffect(() => {
        let mounted = true;
        // end joined room room
        socket.on("joined", args => {
            if (mounted) {
                if (args.data.players.includes(socket.id)) {
                    setRoomid(args.data.roomId)
                    const ran = Math.floor(Math.random() * 2)
                    socket.emit("resetBoard", { 'roomId': args.data.roomId, 'ran': ran })
                }
            }
        });
        return () => mounted = false;
    })
    // update game State 
    useEffect(() => {
        let mounted = true;
        let btns = document.querySelectorAll('.box')
        // end joined room room
        socket.on("updateMoves", args => {
            if (mounted) {
                if (args.data.players.includes(socket.id)) {

                    for (const [key, value] of Object.entries(args.data.positions)) {
                        if (value !== '') {
                            btns[key].innerText = value
                            checkDraw()
                            checkWinner()
                            btns[key].setAttribute("disabled", "")
                            tunSound.play()
                        }
                    }
                    if (args.data.playerWhoMoved === socket.id) {
                        setData(args.data.playerWhoMoved)
                        setwhoesturn('Opponent')
                    } else {
                        setData(null)
                        setwhoesturn('Your')
                    }
                }
            }
        });
        return () => mounted = false;
    })

    // check wining state and update
    useEffect(() => {
        let mounted = true;
        // end joined room room
        socket.on("CheckWinnerSocket", args => {
            if (mounted) {
                if (args.data.players.includes(socket.id)) {
                    if (args.data.wonSymbol === 'X' || args.data.wonSymbol === 'O') {
                        setWon(args.data.wonSymbol)
                    }
                }

            }
        });
        return () => mounted = false;
    })

    // check Draw state and update
    useEffect(() => {
        let mounted = true;
        // end joined room room
        socket.on("checkDrawSocket", args => {
            if (mounted) {
                if (args.data.players.includes(socket.id)) {
                    if (args.data.Draw === true) {
                        setWon('Draw')
                    }
                }

            }
        });
        return () => mounted = false;
    })


    // check restart and update
    useEffect(() => {
        let mounted = true;
        let btns = document.querySelectorAll('.box');
        // end joined room room
        socket.on("reseTboardEmiting", args => {
            if (mounted) {
                if (args.data.players.includes(socket.id)) {
                    for (let i = 0; i < btns.length; i++) {
                        btns[i].innerText = ''
                        btns[i].removeAttribute("disabled")
                    }
                    setWon(null)
                    if (args.data.playerWhoMoved === socket.id) {
                        setData(args.data.playerWhoMoved)
                        setwhoesturn('Opponent')
                    } else {
                        setData(null)
                        setwhoesturn('Your')
                    }
                }
            }
        });
        return () => mounted = false;
    }, [showRoomid])

    // user left
    useEffect(() => {
        let mounted = true;

        // end joined room room
        socket.on("leftUser", args => {
            if (mounted) {
                if (args.data.players.includes(socket.id) && args.data.gameOver === true) {
                    setIsStart(false)
                }
            }
        });
        return () => mounted = false;
    })

    return (
        <div className='game'>
            {showRoomid ? <span className='top'>Room id - {showRoomid}</span> : <></>}
            <div className="game_board">
                {/* top */}
                <button className='box' value="0" onClick={show}></button>
                <button className='box' value="1" onClick={show}></button>
                <button className='box' value="2" onClick={show}></button>


                {/* mid */}
                <button className='box' value="3" onClick={show}></button>
                <button className='box' value="4" onClick={show}></button>
                <button className='box' value="5" onClick={show}></button>

                {/* bottom */}
                <button className='box' value="6" onClick={show}></button>
                <button className='box' value="7" onClick={show}></button>
                <button className='box' value="8" onClick={show}></button>

                <span className="user user1 left"></span>
                {/* {opponent} */}
                <span className="user user2 right"></span>
                <div className={`e ${you === socket.id && 'blockView'}`}></div>
            </div>

            {/* playAgain or quit Screen */}
            {won ? <div className="playAgain" >
                {won === 'Draw' ? <h3 style={{ position: 'absolute', top: '50px', fontSize: '50px', fontFamily: 'sans-serif' }}>{won}</h3>
                    :
                    <h3 style={{ position: 'absolute', top: '50px', fontSize: '50px', fontFamily: 'sans-serif' }}>{won} won.</h3>}
                <span className='playAgainGame' style={{ backgroundColor: 'seagreen' }} onClick={restartGame}>
                    <ReplayIcon />
                </span>
                <span className='quitGame' style={{ backgroundColor: 'crimson' }} onClick={quit}>
                    <CloseIcon />
                </span>
            </div>
                :
                <>
                    {whoesTurn ? <span className='bottom'>{whoesTurn} turn</span> : <></>}
                    <span className='restart' onClick={restartGame}><ReplayIcon /></span>
                    <span className='quit' onClick={quit}><CloseIcon /></span>
                </>
            }
        </div>
    )
}


export default Game;
