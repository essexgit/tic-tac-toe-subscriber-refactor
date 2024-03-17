import View from './view.js'
import Store from './store.js'

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
  const store = new Store('live-t3-storage-key', players)
  // function initView () {
  //   view.closeAll()
  //   view.clearMoves()
  //   view.setTurnIndicator(store.game.currentPlayer)
  //   view.updateScoreboard(store.stats.playerWithStats[0].wins, store.stats.playerWithStats[1].wins, store.stats.ties)
  //   view.initialiseMoves(store.game.moves)
  // }
  window.addEventListener('storage', () => {
    console.log("state changed from another tab")
    view.render(store.game, store.stats)

  })
  view.render(store.game, store.stats)

  view.bindGameResetEvent((event) => {
    store.reset()
    view.render(store.game, store.stats)

  })
  view.bindNewRoundEvent((event) => {
    store.newRound()
    view.render(store.game, store.stats)

  })
  view.bindPlayerMoveEvent((square) => {

    const existingMove = store.game.moves.find((move) => move.squareId === +square.id)
    if (existingMove) {
      return
    }
    // place an icon to the next state by pushing a move to the moves array
    // view.handlePlayerMove(square, store.game.currentPlayer)
    store.playerMove(+square.id)
    view.render(store.game, store.stats)
    // if (store.game.status.isComplete) {
    //   view.openModal(store.game.status.winner ? `${store.game.status.winner.name} wins!`
    //     : "It's a tie!")
    //   return
    // }
    // view.setTurnIndicator(store.game.currentPlayer)
  })

}
window.addEventListener('load', init)
