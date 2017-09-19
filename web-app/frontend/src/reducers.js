

export function mainReducer(state={}, action) {
  console.log('>>', action)
  switch (action.type) {
    default:
      return state
  }
}
