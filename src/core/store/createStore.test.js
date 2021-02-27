import { createStore } from './createStore';

const initialState = {
  count: 0
}
const reducer = (state = initialState, action) => {
  if (action.type === 'ADD') {
    return {...state, count: state.count + 1}
  }
  return state
}

describe('createStore', () => {
  let store
  let handler
  beforeEach(() => {
    store = createStore(reducer, initialState)
    handler = jest.fn()
  })
  it('should return store obj', () => {
    expect(store).toBeDefined()
    expect(store.dispatch).toBeDefined()
    expect(store.subscribe).toBeDefined()
    expect(store.getState).not.toBeUndefined()
  })

  it('should return obj as a state', () => {
    expect(store.getState()).toBeInstanceOf(Object)
  })

  it('should return default state', () => {
    expect(store.getState()).toEqual(initialState)
  })

  it('should change state if action exists', () => {
    store.dispatch({type: 'ADD'})
    expect(store.getState().count).toBe(1)
  })

  it('should NOT change state if action don\'t exists', () => {
    store.dispatch({type: 'NOT_EXISTING_ACTION'})
    expect(store.getState().count).toBe(0)
  })

  it('should call subscriber function', () => {
    store.subscribe(handler)
    store.dispatch({type: 'ADD'})
    expect(handler).toHaveBeenCalled()
    expect(handler).toHaveBeenCalledWith(store.getState())
  })

  it('should NOT call sub if unsubscribe', () => {
    const sub = store.subscribe(handler)
    sub.unsubscribe()

    store.dispatch({type: 'ADD'})

    expect(handler).not.toHaveBeenCalled()
  })

  it('should dispatch in async way', () => {
    return new Promise(resolve => {
      setTimeout(() => {
        store.dispatch({type: 'ADD'})
      }, 100)

      setTimeout(() => {
        expect(store.getState().count).toBe(1)
        resolve()
      }, 200)
    })
  })
})
