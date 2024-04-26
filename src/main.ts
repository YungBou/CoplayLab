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
    setTimeout(async () => {
      searchWebsite = await WA.ui.website.open({
        url: "./search.html",
        position: {
          vertical: "top",
          horizontal: "middle",
        },
        size: {
          height: "54vh",
          width: "63vw",
        },
        margin: {
          top: "1.5vh",
          right: ".5vh",
        },
        allowApi: true,
      });
    }, 250);
  });

  WA.room.area.onLeave("cinema").subscribe(async () => {
    searchWebsite.close();
  });

  WA.event.on("teleport-event").subscribe((event) => {
    console.log("Event received", event.data);
    WA.nav.goToRoom("home.tmj");
  });
  
    WA.ui.onRemotePlayerClicked.subscribe((remotePlayer) => {
      console.log("Le joueur distant a été cliqué:", remotePlayer)
  
      remotePlayer.addAction('Renvoyer le joueur au spawn', () => {
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
