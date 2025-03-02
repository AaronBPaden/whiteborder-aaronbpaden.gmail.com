import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

import Meta from 'gi://Meta';
import St from 'gi://St';
import Clutter from 'gi://Clutter';

let overlay = null;

let overlayState = 0; // 0: disabled, 1: 4x3, 2: 16x9, 3: full screen
let overlayButton = null;
let overlayEventId = null;

const calcFrameSize = (display_width, display_height, frame_aspect_ratio) => {
  const display_aspect_ratio = display_width / display_height;
  if (display_aspect_ratio > frame_aspect_ratio) {
    return {width: Math.round(display_height * frame_aspect_ratio), height: display_height};
  } else {
    return {width: display_width, height: Math.round(display_width / frame_aspect_ratio)};
  }
};

const resetStyle = () => {
  if (overlayState == 0) { // border disabled
    overlay.hide();
    return;
  }
    
  let { 0: width, 1: height } = global.display.get_size();
  let border_size = width > 2560 ? 40 : width >= 1280 ? 20 : 10;
  const display_width = width;
  const display_height = height;

  const fixed_aspect_ratio = {
    1: 4/3,
    2: 16/9,
    3: null // full screen
  }[overlayState];    
  if (fixed_aspect_ratio) {
    ({ width, height } = calcFrameSize(width, height, fixed_aspect_ratio));
  }

  overlay.show();
  const inner_width = width - border_size * 2;
  const inner_height = height - border_size * 2;
  overlay.set_style(
    `background-color: transparent;
        margin-left: ${display_width / 2 - width / 2}px;
        border: ${border_size}px solid white;
        width: ${inner_width}px;
        height: ${inner_height}px;`
  );
};
let resetStyleId = null;

const overlayEvent = () => {
  overlayState = (overlayState + 1) % 4;
  resetStyle();
};

export default class Me extends Extension {

  init() {}

  enable() {
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

  disable() {
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

}
