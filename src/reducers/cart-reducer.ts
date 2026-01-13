import { Guitar, CartItem } from "../types"
import { db } from "../data/db.ts"

export type CartActions = {
    type: 'add-to-cart', payload: { item:  Guitar}
} |
{
    type: 'remove-from-cart', payload: {id: Guitar["id"]}
} |
{
    type: 'increase-quantity', payload: {id: Guitar["id"]}
} |
{
    type: 'decrease-quantity', payload: {id: Guitar["id"]}
} |
{
    type: 'clear-cart'
} 

export type CartState = {
    data: Guitar[]
    cart: CartItem[]
}

const localStorageInitialState = (): CartItem[] => {
    const localStorageCart = localStorage.getItem("cart")
    return localStorageCart ? JSON.parse(localStorageCart) : []
}

export const initialState : CartState = {
    data: db,
    cart: localStorageInitialState()
}



export const cartReducer = (state: CartState, actions: CartActions) => {

    const MAX_ITEMS = 5
    const MIN_ITEMS = 1

    if(actions.type === "add-to-cart"){
        console.log(`Usando add to cart desde el reducer`)

        const itemExist = state.cart.findIndex(i => i.id === actions.payload.item.id)

        let cart: CartItem[]
        console.log(`Item exist: ${itemExist}`)
        if(itemExist === -1) {
            //Cart is empty
            cart = [...state.cart, {...actions.payload.item, quantity: 1}]
        }
        else {
            //Cart has items
            cart = state.cart.map(i => {
                if(i.id === actions.payload.item.id && i.quantity < MAX_ITEMS){
                    return {
                        ...i,
                        quantity: i.quantity + 1
                    }
                }
                else {
                    return i
                }
            })
         
        }
        console.table(cart)
        return {
            ...state,
            cart
        }
    }
    if(actions.type === "remove-from-cart"){
        const updatedCart = state.cart.filter(i => i.id != actions.payload.id )
        return {
            ...state,
            cart: updatedCart
        }
    }
    if(actions.type === "increase-quantity"){
        const updatedCart = state.cart.map(i => {
            if(i.id === actions.payload.id && i.quantity < MAX_ITEMS){
                return {
                    ...i,
                    quantity: i.quantity + 1
                }
            }
            else {
                return i
            }
        })
        return {
            ...state,
            cart: updatedCart
        }
    }
    if(actions.type === "decrease-quantity"){
        const updatedCart = state.cart.map(i => {
            if(i.id === actions.payload.id && i.quantity > MIN_ITEMS) {
                return {
                    ...i,
                    quantity: i.quantity - 1
                }
            }
            else {
                return i
            }
        })
        return {
            ...state,
            cart: updatedCart
        }
    }
    if(actions.type === "clear-cart"){
        
        return {
            ...state,
            cart: []
        }
    }
    return state
}



