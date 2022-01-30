import { createReducer } from '@reduxjs/toolkit'
import { clearBoardHistory, updateBoardState } from './actions'

const boardSize = 100
const freshBoard = () =>
    Array(boardSize)
        .fill(false)
        .map(() => Array(boardSize).fill(false))

const initialState = { boardHistory: [freshBoard()], board: freshBoard() }

export const boardReducer = createReducer(initialState, (builder) => {
    //builder should modify draftState XOR return a new state
    builder
        .addCase(clearBoardHistory, (draftState, action) => {
            draftState.boardHistory = []
            draftState.board = action.payload
        })
        .addCase(updateBoardState, (draftState, action) => {
            draftState.boardHistory.push(action.payload)
            draftState.board = action.payload
        })
})
