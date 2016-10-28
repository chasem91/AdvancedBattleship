const takeTurn = () => {
  opponentTurn = !opponentTurn;
  playerTurn = !playerTurn;

  if (opponentTurn) {
    fireProjectile();
  } else if (playerTurn) {
    console.log("players turn!");
  }
}
