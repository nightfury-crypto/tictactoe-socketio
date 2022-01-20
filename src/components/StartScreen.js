import React, { useState } from 'react'
import './StartScreen.css'
import logo from '../img/tictactoe.png'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const StartScreen = ({ checkStart, JoinGame, setjoinId, joinid, Create_room }) => {
    const [multiplayer, setMultiplayer] = useState(false);

    const multiplayerTime = () => {
        setMultiplayer(true)
    }
    const quit = () => {
        setMultiplayer(false)
    }
    if (multiplayer) {
        return (<div className='start'>
            <a className='quit' onClick={quit}><ArrowBackIcon /></a>
            <img src={logo}
                alt="logo" />
            <span className='roomChoose'>
                <button onClick={Create_room}>Create Room</button>
                <span>OR</span>
                <form onSubmit={JoinGame}>
                    <fieldset>
                        <legend>Room id</legend>
                        <input type="text" id="roomid" name="roomid" placeholder='Enter room id'
                            value={joinid} onChange={(e) => setjoinId(e.target.value)}
                        ></input>
                    </fieldset>

                    <button type='submit'>Join Room</button>
                </form>
            </span>
        </div>)
    } else {
        return (
            <div className='start'>
                <img src={logo} alt="logo" />
                <span>
                    <button onClick={checkStart}>Offline</button>
                    <button onClick={multiplayerTime}>online</button>
                </span>
            </div>
        )
    }
}

export default StartScreen
