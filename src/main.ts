/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

let currentPopup: any = undefined;
let config = WA.state.loadVariable("config");

// Create an iframe element
const iframe = document.createElement("iframe");
iframe.src = "https://example.com";
iframe.style.width = "100%";
iframe.style.height = "100%";
iframe.style.border = "none";

// Waiting for the API to be ready
WA.onInit().then(() => {
  // console.log("Scripting API ready");
  // console.log("Player tags: ", WA.player.tags);

  WA.room.area.onEnter("clock").subscribe(() => {
    const today = new Date();
    const time = today.getHours() + ":" + today.getMinutes();
    currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
  });

  WA.room.area.onLeave("clock").subscribe(closePopup);

  let noteWebsite: any;

  WA.room.area.onEnter("cinema").subscribe(async () => {
    console.log("Entering visibleNote layer");

    noteWebsite = await WA.ui.website.open({
      url: "./search.html",
      position: {
        vertical: "top",
        horizontal: "middle",
      },
      size: {
        height: "30vh",
        width: "50vw",
      },
      margin: {
        top: "10vh",
      },
      allowApi: true,
    });
  });

  WA.room.area.onLeave("cinema").subscribe(() => {
    noteWebsite.close();
  });

  // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
  bootstrapExtra().then(() => {
    // console.log("Scripting API Extra ready");
  });
  //   .catch((e) => console.error(e));
});
//   .catch((e) => console.error(e));

function closePopup() {
  if (currentPopup !== undefined) {
    currentPopup.close();
    currentPopup = undefined;
  }
}

export {};
