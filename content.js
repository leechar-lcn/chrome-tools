chrome.runtime.onMessage.addListener(onClick);

const CHARACTERS = "dynamicSchema";

function onClick() {
  const { href } = location;
  const hasParams = href.indexOf("?") !== -1;

  if (hasParams) {
    const isConnected = href.indexOf(CHARACTERS) !== -1;

    if (isConnected) {
      location.replace(removeParams(CHARACTERS));
    } else {
      location.replace(addParams(CHARACTERS));
    }
  } else {
    location.replace(addParams(CHARACTERS));
  }
}

function addParams(params) {
  const { href } = location;
  let result = href;

  if (href.indexOf("?") === -1) {
    result += "?" + params;
  } else {
    result += "&" + params;
  }

  return result;
}

function removeParams(params) {
  const { href } = location;
  let result = href;

  if (href.indexOf("?" + params) === -1) {
    result = result.replace("&" + params, "");
  } else {
    result = result.replace("?" + params, "");
  }

  return result;
}
