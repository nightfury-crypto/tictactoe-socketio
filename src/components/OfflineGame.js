import React, { useState } from 'react';
import './OfflineGame.css';
import tunaudio from '../audio/Mclick1.mp3'
import wonaudio from '../audio/wonSound.wav'
import ReplayIcon from '@mui/icons-material/Replay';
import CloseIcon from '@mui/icons-material/Close';

const OfflineGame = ({ setisOfflineStart }) => {
    const [pValue, setPValue] = useState('X')
    const [turn, setTurn] = useState(1)
    const [won, setWon] = useState(null)


    // imported sounds
    let tunSound = new Audio(`${tunaudio}`)
    let wonSound = new Audio(`${wonaudio}`)

    // play game
    const show = (e) => {
        tunSound.play()
        if (turn % 2 === 0) {
            setPValue('X')
            setTurn(turn + 1)
        } else {
            setPValue('O')
            setTurn(turn + 1)

        }

        e.target.setAttribute("disabled", "")
        e.target.innerText = pValue
        e.target.value = pValue
        const winner = checkWinner()
        if (winner) {
            setWon(winner)
        }
        if(winner === null) {
            checkDraw()
        }
    }

    // restart game
    const restartGame = () => {
        let btns = document.querySelectorAll('.box');

        for (let i = 0; i < btns.length; i++) {
            btns[i].innerText = ''
            btns[i].removeAttribute("disabled")
            btns[i].value = ''
        }
        setWon(null)
        setPValue('X')
        setTurn(1)
    }

    // quit game
    const quit = () => {
        setisOfflineStart(false)

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
            if (btns[a].value && btns[a].value === btns[b].value && btns[b].value === btns[c].value) {
                wonSound.play()
                return btns[a].value
            }
        }
        return null
    }

    // checkDraw
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
            setWon('Draw')
            return "Draw"
        }

    }


    return (
        <div className='game'>
            <div className="game_board">
                {/* top */}
                <button className='box' onClick={show}></button>
                <button className='box' onClick={show}></button>
                <button className='box' onClick={show}></button>


                {/* mid */}
                <button className='box' onClick={show}></button>
                <button className='box' onClick={show}></button>
                <button className='box' onClick={show}></button>

                {/* bottom */}
                <button className='box' onClick={show}></button>
                <button className='box' onClick={show}></button>
                <button className='box' onClick={show}></button>

                <span className="user user1 left"></span>
                <span className="user user2 right"></span>
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
                    <span className='restart' onClick={restartGame}><ReplayIcon /></span>
                    <span className='quit' onClick={quit}><CloseIcon /></span>
                </>
            }


        </div>
    )
}


export default OfflineGame;