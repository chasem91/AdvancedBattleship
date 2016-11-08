class Game {
  constructor() {
    this.player = new Player();
    this.opponent = new Opponent();
    this.players = [this.opponent, this.player];
    // this.players = [this.player, this.opponent];
  }

  play() {
    this.switchPlayers();
    this.playTurn();
  }

  won() {
    return this.player.ships.every( ship => ship.isDestroyed ) || this.opponent.ships.every( ship => ship.isDestroyed )
  }

  currentPlayer() {
    return this.players[0];
  }

  playTurn() {
    this.currentPlayer().playTurn();
  }

  switchPlayers() {
    this.players = [this.players[1], this.players[0]];
  }
}
