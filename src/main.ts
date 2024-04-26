/// <reference types="@workadventure/iframe-api-typings" />

let currentPopup: any = undefined;
let config = WA.state.loadVariable("config");
function startVideoLoop() {
  const videoElement = document.getElementById('myLiveStreamScreen') as HTMLVideoElement;
  
  // Événement de fin de lecture de la vidéo
  videoElement.addEventListener('ended', () => {
      // Rejouer la vidéo depuis le début
      videoElement.currentTime = 0;
      videoElement.play();
  });

  // Lancer la vidéo
  videoElement.play();
}

// Waiting for the API to be ready
WA.onInit().then(() => {
  startVideoLoop();
  WA.room.area.onEnter("clock").subscribe(() => {
    const today = new Date();
    const time = today.getHours() + ":" + today.getMinutes();
    currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
  });

  WA.room.area.onLeave("clock").subscribe(closePopup);

  let searchWebsite: any;

  WA.room.area.onEnter("cinema").subscribe(async () => {
    searchWebsite = await WA.room.website.create({
      name: "player",
      url: "./search.html",
      position: {
        x: 141.88,
        y: 88.12,
        height: 253.79,
        width: 485.55,
      },
      allowApi: true,
      scale: 0.5,
    });
  });

  WA.room.area.onLeave("cinema").subscribe(async () => {
    WA.room.website.delete("player");
  });

  WA.event.on("teleport-event").subscribe((event) => {
    console.log("Event received", event.data);
    WA.nav.goToRoom("home.tmj");
  });

  WA.ui.onRemotePlayerClicked.subscribe((remotePlayer) => {
    console.log("Le joueur distant a été cliqué:", remotePlayer);

    remotePlayer.addAction("Renvoyer le joueur au spawn", () => {
      remotePlayer.sendEvent("teleport-event", "my payload");
    });
  });

  function closePopup() {
    if (currentPopup !== undefined) {
      currentPopup.close();
      currentPopup = undefined;
    }
  }
});
export {};
