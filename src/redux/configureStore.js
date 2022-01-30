import { applyMiddleware, compose, createStore } from 'redux'
import thunk, { ThunkDispatch } from 'redux-thunk'
import { configureStore } from '@reduxjs/toolkit'
import { boardReducer } from '../reducer'

export const appStore = configureStore({
    reducer: {
        board: boardReducer,
    },
})

export const dispatch = appStore.dispatch
