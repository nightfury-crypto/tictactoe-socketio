import { useState, useEffect } from 'react';
import './App.css';
import Game from './components/Game.js'
import StartScreen from './components/StartScreen';
import io from 'socket.io-client'
import WaitingLobby from './components/WaitingLobby';
import OfflineGame from './components/OfflineGame';

// connection with socket io
const socket = io.connect("http://localhost:5000")


function App() {
  const [isStart, setIsStart] = useState(false)
  const [joinid, setjoinId] = useState('')
  const [waiting, setwaiting] = useState(false)
  const [getRoomid, setRoomid] = useState(null)
  const [isOfflineStart, setisOfflineStart] = useState(false)

  // redirect to gameScreen only same player

  useEffect(() => {
    socket.on("joined", args => {
      if (args.data.players.length === 2 && args.data.gameStart === true && args.data.players.includes(socket.id) === true) {
        setIsStart(true)
        setwaiting(false)
      }
      if (args.data.players.includes(socket.id) === true && args.data.gameStart === false) {
        setRoomid(args.data.roomId)
        setwaiting(true)
      }
    })
  })

  // check room full or not
  useEffect(() => {
    socket.on('roomWarn', args => {
      if (args.roomwarning === true) {
        alert(args.text)
      }
    })
  })
  // join game
  const JoinGame = (e) => {
    e.preventDefault();
    socket.emit("Join_Room", joinid)

    setjoinId('')
  }

  const checkStart = () => {
    setisOfflineStart(true)
  }

  // create room
  const Create_room = () => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (let i = 0; i < charactersLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    result = result.substring(0, 6)

    if (result !== '') {
      setRoomid(result)
      socket.emit("create_Room", result);
      return result
    }
  }
  const lobbyquit = () => {
    socket.emit("delete", {'roomId': getRoomid})
    setwaiting(false)
    setIsStart(false)
  }


  if (waiting) {
    return <WaitingLobby getRoomid={getRoomid} lobbyquit={lobbyquit} />
  }
  else if (isOfflineStart) {
    return (
    <div className="App" >
      <OfflineGame setisOfflineStart={setisOfflineStart} />
    </div>)
  }
  else {
    return (
      <div className="App" >
        {isStart ? <Game setIsStart={setIsStart} socket={socket} />
          :
          <StartScreen checkStart={checkStart} setIsStart={setIsStart} JoinGame={JoinGame} setjoinId={setjoinId} joinid={joinid} Create_room={Create_room} />}

      </div>
    );
  }

}

export default App;
