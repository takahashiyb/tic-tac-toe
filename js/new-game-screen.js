export function loadNewGameButtonFunction() {
  const buttonNewSoloGame = document.getElementById("button-new-solo-game");

  buttonNewSoloGame.addEventListener("click", () => {
    window.location.href = "../solo-game.html";
  });

  const buttonNew2pGame = document.getElementById("button-new-2p-game");

  buttonNew2pGame.addEventListener("click", () => {
    window.location.href = "../pair-game.html";
  });
}

loadNewGameButtonFunction();
