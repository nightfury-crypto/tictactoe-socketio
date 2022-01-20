import React, { useRef, useState } from 'react';
import './WaitingLobby.css'
import { MutatingDots } from "react-loader-spinner";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

const WaitingLobby = ({ getRoomid, lobbyquit }) => {
    const [title, setTitle] = useState('copy')
    const itemTocopyRef = useRef(null)

    const copy = () => {
        let value = null
        value = itemTocopyRef.current.innerText;
        if (value) {
            navigator.clipboard.writeText(value);
            setTitle('copied');
        }
    }
    return (
        <div className='waiting'>
            <a className='quit' onClick={lobbyquit}><ArrowBackIcon /></a>
            <p id="waiting__roomid" onClick={copy}>Room id :
                <span ref={itemTocopyRef}>{getRoomid}</span>

                <Tooltip title={title} >
                    <IconButton onClick={copy}>
                        <ContentCopyIcon />
                    </IconButton>
                </Tooltip>
            </p>
            <p>Waiting for the opponent to join...</p>
            <MutatingDots arialLabel="loading-indicator" />
        </div>
    )
}

export default WaitingLobby;
