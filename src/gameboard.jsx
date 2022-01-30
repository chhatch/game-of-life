import Button from 'react-bootstrap/Button'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { clearBoardHistory, updateBoardState } from './actions'
import { gravMap } from './randomGravity'

const mapStateToProps = (state) => ({ board: state.board.board })
const mapDispatchToProps = { clearBoardHistory, updateBoardState }

const squareColor = (board) => (y, x) => (board[y][x] ? 'black' : 'white')
const boardSize = 100
const freshBoard = () =>
    Array(boardSize)
        .fill(false)
        .map(() => Array(boardSize).fill(false))
const cloneBoard = (board) => board.map((row) => [...row])
const flipSquare = (board) => (y, x) => {
    const draftBoard = cloneBoard(board)
    draftBoard[y][x] = !draftBoard[y][x]
    return draftBoard
}

const randomBoard = () =>
    freshBoard().map((row) =>
        row.map((_) => (Math.random() > 0.5 ? true : false))
    )

const renderBoard = (board, updateBoardState, running) => (
    <div
        style={{ width: 'fit-content' }}
        className="d-flex justify-content-start flex-column border-start border-top border-dark"
    >
        {board.map((_, y) => (
            <div key={y} className="d-flex justify-content-start flex-row">
                {board[y].map((_, x) => (
                    <div
                        key={x}
                        style={{
                            width: '10px',
                            height: '10px',
                            backgroundColor: squareColor(board)(y, x),
                            cursor: 'pointer',
                        }}
                        className="border-end border-bottom border-dark"
                        onClick={() =>
                            !running
                                ? updateBoardState(flipSquare(board)(y, x))
                                : ''
                        }
                    ></div>
                ))}
            </div>
        ))}
    </div>
)

const Screen = ({ board, clearBoardState, updateBoardState }) => {
    const [running, setRunning] = useState(false)
    const [random, setRandom] = useState(false)
    const [timerId, setTimerId] = useState(null)

    const updateBoard = (board) => {
        let draftBoard = board.map((row, y) => {
            const yAbove = y === 0 ? board.length - 1 : y - 1
            const yBelow = y === board.length - 1 ? 0 : y + 1
            return row.map((cell, x) => {
                //y shouldn't matter here as all rows should be same length
                const xLeft = x === board[y].length - 1 ? 0 : x + 1
                const xRight = x === 0 ? board[y].length - 1 : x - 1
                //start sum at 12 o'clock
                const neighborSum =
                    board[yAbove][x] +
                    board[yAbove][xRight] +
                    board[y][xRight] +
                    board[yBelow][xRight] +
                    board[yBelow][x] +
                    board[yBelow][xLeft] +
                    board[y][xLeft] +
                    board[yAbove][xLeft]
                //if cell is alive
                if (board[y][x]) {
                    if (neighborSum === 2 || neighborSum === 3) {
                        return true
                    } else {
                        return false
                    }
                    //cell dead
                } else {
                    if (neighborSum === 3) {
                        return true
                    } else {
                        return false
                    }
                }
            })
        })
        if (random) {
            draftBoard = gravMap(draftBoard)
            /*draftBoard.map((row, y) =>
                row.map((value, x) => (Math.random() <= 0.999 ? value : !value))
            )
            */
        }
        updateBoardState(draftBoard)
    }

    useEffect(() => {
        if (running && !timerId) {
            setTimerId(
                setTimeout(() => {
                    updateBoard(board)
                    setTimerId(null)
                }, 100)
            )
        } else if (!running && timerId) {
            clearInterval(timerId)
            setTimerId(null)
        }
    })

    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            {renderBoard(board, updateBoardState, running)}{' '}
            <div className="d-flex flex-row">
                <Button
                    onClick={() => setRunning(!running)}
                    className="mt-2 me-2"
                >
                    {running ? 'Stop' : 'Start'}
                </Button>
                <Button
                    onClick={() => {
                        //the parentheses after randomBoard seem to be optional
                        if (!running) {
                            updateBoardState(randomBoard())
                            clearBoardHistory(freshBoard())
                        }
                    }}
                    className="mt-2 me-2"
                >
                    Random Board
                </Button>
                <Button
                    onClick={() => setRandom(!random)}
                    className="mt-2 me-2"
                >
                    {!random ? 'Add Random' : 'Remove Random'}
                </Button>
                <Button
                    onClick={() => {
                        if (!running) {
                            updateBoardState(freshBoard())
                            clearBoardHistory(freshBoard())
                        }
                    }}
                    className="mt-2"
                >
                    Clear Board
                </Button>
            </div>
        </div>
    )
}

export const Gameboard = connect(mapStateToProps, mapDispatchToProps)(Screen)
