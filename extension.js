const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const { Meta, St, Clutter } = imports.gi;

let overlay = null;

let overlayState = 0; // 0: disabled, 1: 4x3, 2: 16x9, 3: full screen
let overlayButton = null;
let overlayEventId = null;

const fourByThree = (width, height) => {
  const resolutions = [
    [8192, 6144],
    [7680, 5760],
    [6144, 4608],
    [5120, 3840],
    [4096, 3072],
    [3840, 2880],
    [3072, 2304],
    [2880, 2160],
    [2560, 1920],
    [2048, 1536],
    [1920, 1440],
    [1856, 1392],
    [1600, 1200],
    [1440, 1080],
    [1400, 1050],
    [1280, 960],
    [1152, 864],
    [1024, 768],
    [960, 720],
    [800, 600],
    [640, 480],
    [320, 240],
  ];
  let resolution = null;
  resolutions.forEach((r) => {
    if (width >= r[0] && height >= r[1] && resolution == null) {
      resolution = { width: r[0], height: r[1] };
    }
  });
  return resolution;
};

const sixteenByNine = (width, height) => {
  const resolutions = [
    [7680, 4320],
    [5120, 2880],
    [3840, 2160],
    [2560, 1440],
    [1920, 1080],
    [1600, 900],
    [1366, 768],
    [1280, 720],
    [1024, 576],
    [960, 540],
    [854, 480],
    [640, 360],
    [320, 180],
  ];
  let resolution = null;
  resolutions.forEach((r) => {
    if (width >= r[0] && height >= r[1] && resolution == null) {
      resolution = { width: r[0], height: r[1] };
    }
  });
  return resolution;
};

const resetStyle = () => {
  let { 0: width, 1: height } = global.display.get_size();
  let border_size = width > 2560 ? 40 : width >= 1280 ? 20 : 10;
  const display_width = width;
  const display_height = height;

  switch (overlayState) {
    case 0: // disabled
      overlay.hide();
      return;
    case 1: // 4x3
      ({ width, height } = fourByThree(width, height));
      break;
    case 2: // 16x9
      ({ width, height } = sixteenByNine(width, height));
      break;
    case 3: // full screen
      break;
  }

  overlay.show();
  width -= border_size * 2;
  height -= border_size * 2;
  overlay.set_style(
    `background-color: transparent;
        margin-left: ${
          overlayState === 1 || overlayState === 2
            ? display_width / 2 - width / 2
            : 0
        }px;
        border: ${border_size}px solid white;
        width: ${width}px;
        height: ${height}px;`
  );
};

const overlayEvent = () => {
  overlayState = (overlayState + 1) % 4;
  resetStyle();
};

function init() {}

function enable() {
  // log("Enabling White Border Overlay");
  Meta.disable_unredirect_for_display(global.display);

  overlay = new St.Widget();
  resetStyle();
  Main.layoutManager.addChrome(overlay, { affectsInputRegion: false });
  resetStyleId = global.window_manager.connect("size-changed", resetStyle);

  overlayButton = new St.Bin({
    style_class: "panel-button",
    reactive: true,
    can_focus: true,
    track_hover: true,
  });
  overlayButton.set_child(
    new St.Label({ text: "  ▣  ", y_align: Clutter.ActorAlign.CENTER })
  );
  overlayEventId = overlayButton.connect("button-press-event", overlayEvent);
  Main.panel._rightBox.insert_child_at_index(overlayButton, 0);
}

function disable() {
  // log("Disabling White Border Overlay");

  Main.layoutManager.removeChrome(overlay);
  overlay.destroy();
  overlay = null;

  Meta.enable_unredirect_for_display(global.display);

  Main.panel._rightBox.remove_child(overlayButton);
  overlayButton.disconnect(overlayEventId);
  overlayButton.destroy_all_children();
  overlayButton.destroy();
  overlayButton = null;
  overlayEventId = null;

  global.window_manager.disconnect(resetStyleId);
  resetStyleId = null;
}
