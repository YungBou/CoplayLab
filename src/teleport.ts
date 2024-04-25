/// <reference types="@workadventure/iframe-api-typings" />

let teleportPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(() => {
  
  WA.room.area.onEnter("teleport").subscribe(() => {
    console.log("vous êtes dans la zone de téléportation");
    WA.ui.openPopup("teleportPopup", "Voulez-vous vous téléporter vers la salle de cinéma ?", [
      {
        label: "Oui",
        className: "primary",
        callback: () => {
          WA.nav.goToRoom("conference.tmj");
        },
      },
      {
        label: "Non",
        callback: (popup) => {
          popup.close();
        },
      },
    ]);
  });
});

WA.room.area.onLeave("teleport").subscribe(closePopupMap);

WA.event.on("teleport-event").subscribe((event) => {
  console.log("Event received", event.data);
  WA.nav.goToRoom("conference.tmj");
});

  WA.ui.onRemotePlayerClicked.subscribe((remotePlayer) => {
    console.log("Le joueur distant a été cliqué:", remotePlayer)

    remotePlayer.addAction('Téléportation', () => {
      remotePlayer.sendEvent("teleport-event", "my payload");
  }); 
});

  function closePopupMap() {
    if (teleportPopup !== undefined) {
      teleportPopup.close();
      teleportPopup = undefined;
    }
  }

export {};