# White Border Overlay

## An extension for Gnome-Shell

This extension will create a white border around the display. This should allow Sinden Lightguns to work even if there isn't support for custom overlays in the application.

You can install it from extensions.gnome.org here: https://extensions.gnome.org/extension/4922/white-border-overlay/


## WARNING

**Applications cannot bypass the compositor** while this extension is active. Native overlay support is still preferred.

Running games with compositing has input latency implications, will prevent VRR from activating and for modern, more demanding games the performance penalty may be prohibitive.

That said, this extension is useful for running standalone emulators like Supermodel and PCSX2, as well as older Windows applications in Wine like HOTD.


## Supported versions

Currently, this only supports Gnome 41. If someone tests with an earlier version and finds it still working, I'll add that version to the metadata.json.


## Games Tested Working

* House of the Dead 2 (PC version running in Wine)
* Mad Bullets (Steam/Proton)
* Supermodel Emulator (native Linux application)


## Games Confirmed Not Working

* House of the Dead (PC version running in Wine. Border shows up. Issues are probably not related to the extension)
