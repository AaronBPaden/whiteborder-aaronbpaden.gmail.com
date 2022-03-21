const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const { Meta, St, Clutter } = imports.gi;


let overlay = null;

let useFourByThree = null;
let fourByThreeButton = null;
let fourByThreeEventId = null;

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
    resolutions.forEach(r => {
        if (width >= r[0] && height >= r[1] && resolution == null) {
            resolution = {width: r[0], height: r[1]};
        }
    });
    return resolution;
};

const resetStyle = () => {
    let {0: width, 1: height} = global.display.get_size();
    let border_size = 
        width > 2560 ? 20 :
        width >= 1280 ? 10 : 5;
    const display_width = width;
    const display_height = height;
    ({width, height} = useFourByThree ? fourByThree(width, height) : {width, height});
    width -= border_size*2;
    height -= border_size*2;
    overlay.set_style(
        `background-color: transparent;
        margin-left: ${useFourByThree ? (display_width / 2) - (width / 2) : 0}px;
        border: ${border_size}px solid white;
        width: ${width}px;
        height: ${height}px;`
    );
};
let resetStyleId = null;

const fourByThreeEvent = () => {
    useFourByThree = !useFourByThree;
    resetStyle();
};

const enable = () => {
    // log("Enabling White Border Overlay");
    Meta.disable_unredirect_for_display(global.display);

    overlay = new St.Widget();
    resetStyle();
    Main.layoutManager.addChrome(overlay, {affectsInputRegion: false});
    resetStyleId = global.window_manager.connect('size-changed', resetStyle);

    fourByThreeButton = new St.Bin({
        style_class: 'panel-button',
        reactive: true,
        can_focus: true,
        track_hover: true
    });
    fourByThreeButton.set_child(new St.Label({text: '4:3', y_align: Clutter.ActorAlign.CENTER}));
    fourByThreeEventId = fourByThreeButton.connect('button-press-event', fourByThreeEvent);
    Main.panel._rightBox.insert_child_at_index(fourByThreeButton, 0);
};

const disable = () => {
    // log("Disabling White Border Overlay");

    Main.layoutManager.removeChrome(overlay);
    overlay.destroy();
    overlay = null;

    Meta.enable_unredirect_for_display(global.display);

    Main.panel._rightBox.remove_child(fourByThreeButton);
    fourByThreeButton.disconnect(fourByThreeEventId);
    fourByThreeButton.destroy_all_children();
    fourByThreeButton.destroy();
    fourByThreeButton = null;
    fourByThreeEventId = null;

    global.window_manager.disconnect(resetStyleId);
    resetStyleId = null;
};

const init = () => {};
