import View from './view.js'
import Store from './store.js'
const App = {
  $: {
    menu: document.querySelector('[data-id="menu"]'),
    menuItems: document.querySelector('[data-id="menu-items"]'),
    resetBtn: document.querySelector('[data-id="reset-btn"]'),
    newRoundBtn: document.querySelector('[data-id="new-round-btn"]'),
    squares: document.querySelectorAll('[data-id="square"]'),
    modal: document.querySelector('[data-id="modal"]'),
    modalText: document.querySelector('[data-id="modal-text"]'),
    modalBtn: document.querySelector('[data-id="modal-btn"]'),
    turn: document.querySelector('[data-id="turn"]'),
  },
  state: {
    moves: [],
  },

  getGameStatus (moves) {
    const p1Moves = moves.filter(move => move.playerId === 1).map(move => +move.squareId)
    const p2Moves = moves.filter(move => move.playerId === 2).map(move => +move.squareId)
    const winningPatterns = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 5, 7],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ];
    let winner = null;

    winningPatterns.forEach(pattern => {
      const p1Wins = pattern.every(v => p1Moves.includes(v))
      const p2Wins = pattern.every(v => p2Moves.includes(v))

      if (p1Wins) winner = 1
      if (p2Wins) winner = 2
    })
    return {
      status: moves.length === 9 || winner !== null ? 'complete' : 'in-progress',
      winner // 1 | 2 | null
    }
  },

  init () {
    App.registerEventListeners()
  },

  registerEventListeners () {
    App.$.menu.addEventListener('click', event => {
      App.$.menuItems.classList.toggle('hidden')
    })
    App.$.resetBtn.addEventListener('click', (e) => {
      console.log(e.target)
    })
    App.$.newRoundBtn.addEventListener('click', (e) => {
      console.log(e.target)
    })
    App.$.modalBtn.addEventListener('click', (e) => {
      App.state.moves = []
      App.$.squares.forEach(square => square.replaceChildren())
      App.$.modal.classList.add('hidden')
    })

    App.$.squares.forEach((square) => {
      square.addEventListener('click', (event) => {
        // check if there is already a play, then return early
        const hasMove = (squareId) => {
          const existingMove = App.state.moves.find(move => move.squareId === squareId)
          return existingMove !== undefined
        }
        if (hasMove(+square.id)) {
          return
        }

        // Determine which player icon to add to the square
        const lastMove = App.state.moves.at(-1)
        const getOppositePlayer = (playerId) => playerId === 1 ? 2 : 1
        const currentPlayer =
          App.state.moves.length === 0
            ? 1
            : getOppositePlayer(lastMove.playerId)
        const nextPlayer = getOppositePlayer(currentPlayer)
        const squareIcon = document.createElement('i')
        const turnIcon = document.createElement('i')
        const turnLabel = document.createElement('p')
        turnLabel.innerText = `Player ${nextPlayer} you are up!`

        if (currentPlayer === 1) {
          squareIcon.classList.add('fa-solid', 'fa-x', 'turquoise')
          turnIcon.classList.add('fa-solid', 'fa-o', 'yellow')
          turnLabel.classList.add('yellow')
        } else {
          squareIcon.classList.add('fa-solid', 'fa-o', 'yellow')
          turnIcon.classList.add('fa-solid', 'fa-x', 'turquoise')
          turnLabel.classList.add('turquoise')
        }
        square.replaceChildren(squareIcon)

        App.$.turn.replaceChildren(turnIcon, turnLabel)
        App.state.moves.push({
          squareId: +square.id,
          playerId: currentPlayer
        })
        //check if there  is a winner or a tie game
        const game = App.getGameStatus(App.state.moves)
        if (game.status === 'complete') {
          App.$.modal.classList.remove('hidden')
          let message = ''
          if (game.winner) {
            message = `Player ${game.winner.name} wins!`
          } else {
            message = `It's a tie!`
          }
          App.$.modalText.textContent = message
        }
      })
    })
  },
}
const players = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-x",
    colorClass: "turquoise",
  },
  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "yellow",
  },
];
// window.addEventListener('load', App.init)

function init () {
  const view = new View()
  const store = new Store(players)
  view.bindGameResetEvent(event => {
    console.log("Reset Game ")
    console.log(event.target)
  })
  view.bindNewRoundEvent(event => {
    console.log("New Round")
    console.log(event.target)
  })
  view.bindPlayerMoveEvent((square) => {

    const existingMove = store.game.moves.find((move) => move.squareId === +square.id)
    if (existingMove) {
      return
    }
    // place an icon to the next state by pushing a move to the moves array
    view.handlePlayerMove(square, store.game.currentPlayer)
    store.playerMove(+square.id)
    if (store.game.status.isComplete) {
      view.openModal(store.game.status.winner ? `${store.game.status.winner.name} wins!`
        : "It's a tie!")
      return
    }
    view.setTurnIndicator(store.game.currentPlayer)
  })

}
window.addEventListener('load', init)
