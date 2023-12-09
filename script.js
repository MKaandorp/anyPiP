(() => {
  const copyStyleSheets = (pipWindow) => {
    [...document.styleSheets].forEach((styleSheet) => {
      try {
        const cssRules = [...styleSheet.cssRules]
          .map((rule) => rule.cssText)
          .join("");
        const style = document.createElement("style");

        style.textContent = cssRules;
        pipWindow.document.head.appendChild(style);
      } catch (e) {
        const link = document.createElement("link");

        link.rel = "stylesheet";
        link.type = styleSheet.type;
        link.media = styleSheet.media;
        link.href = styleSheet.href;
        pipWindow.document.head.appendChild(link);
      }
    });
  };

  const replaceWithPlaceHolder = (element) => {
    const placeHolder = document.createElement("div");
    placeHolder.id = "PIPPlaceHolder";
    placeHolder.style.display = "none";
    element.replaceWith(placeHolder);
  };

  const restorePIPElement = (event) => {
    const pipElement = event.target.body.firstChild;
    const placeHolder = document.querySelector("#PIPPlaceHolder");
    placeHolder.replaceWith(pipElement);
  };

  const openInPip = async (element) => {
    const pipWindow = await documentPictureInPicture.requestWindow();
    copyStyleSheets(pipWindow);
    replaceWithPlaceHolder(element);
    pipWindow.document.body.append(element);
    pipWindow.addEventListener("pagehide", restorePIPElement);
  };

  const cleanupEventListeners = () => {
    document.body.removeEventListener("click", onClick);
    document.body.removeEventListener("mousemove", onMouseMove);
    document.body.removeEventListener("mouseout", onMouseOut);
  };

  const onClick = (e) => {
    e.preventDefault();
    e.target.classList.remove("hover");
    cleanupEventListeners();
    openInPip(e.target);
  };

  const onMouseMove = (e) => {
    e.preventDefault();
    e.target.classList.add("hover");
  };

  const onMouseOut = (e) => {
    e.preventDefault();
    e.target.classList.remove("hover");
  };

  document.body.addEventListener("click", onClick);
  document.body.addEventListener("mousemove", onMouseMove);
  document.body.addEventListener("mouseout", onMouseOut);
})();
