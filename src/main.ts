/// <reference types="@workadventure/iframe-api-typings" />

let currentPopup: any = undefined;
let config = WA.state.loadVariable("config");

// Waiting for the API to be ready
WA.onInit().then(() => {
  WA.room.area.onEnter("clock").subscribe(() => {
    const today = new Date();
    const time = today.getHours() + ":" + today.getMinutes();
    currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
  });

  WA.room.area.onLeave("clock").subscribe(closePopup);

  let searchWebsite: any;

  WA.room.area.onEnter("cinema").subscribe(async () => {
    searchWebsite = await WA.ui.website.open({
      url: "./search.html",
      position: {
        vertical: "top",
        horizontal: "middle",
      },
      size: {
        height: "50vh",
        width: "60vw",
      },
      margin: {
        top: "10vh",
      },
      allowApi: true,
    });
  });

  WA.room.area.onLeave("cinema").subscribe(() => {
    searchWebsite.close();
  });

  function closePopup() {
    if (currentPopup !== undefined) {
      currentPopup.close();
      currentPopup = undefined;
    }
  }
});
export {};
