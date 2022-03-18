const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const Main = imports.ui.main;
const { Meta, St } = imports.gi;

let overlay = null;

const resetStyle = () => {
    let {0: width, 1: height} = global.display.get_size();
    let border_size = 
        width > 2560 ? 20 :
        width >= 1280 ? 10 : 5;
    width -= border_size*2;
    height -= border_size*2;
    overlay.set_style(
        `background-color: transparent;
        border: ${border_size}px solid white;
        width: ${width}px;
        height: ${height}px;`
    );
};
let resetStyleId = null;

const enable = () => {
    // log("Enabling White Border Overlay");
    Meta.disable_unredirect_for_display(global.display);

    overlay = new St.Widget();
    resetStyle();
    Main.layoutManager.addChrome(overlay, {affectsInputRegion: false});

    resetStyleId = global.window_manager.connect('size-changed', resetStyle);
};

const disable = () => {
    // log("Disabling White Border Overlay");

    Main.layoutManager.removeChrome(overlay);
    overlay.destroy();
    overlay = null;

    Meta.enable_unredirect_for_display(global.display);

    global.window_manager.disconnect(resetStyleId);
    resetStyleId = null;
};

const init = () => {};
