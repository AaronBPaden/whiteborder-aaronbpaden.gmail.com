# White Border Overlay

## An extension for Gnome-Shell

This extension will create a white border around the display. This should allow Sinden Lightguns to work even if there isn't support for custom overlays in the application.


## WARNING

**Applications cannot bypass the compositor** while this extension is active. Native overlay support is still preferred.

Running games with compositing has input latency implications, will prevent VRR from activating and for modern, more demanding games the performance penalty may be prohibitive.

That said, this extension is useful for running standalone emulators like Supermodel and PCSX2, as well as older Windows applications in Wine like HOTD.

The aspect ratio of the border will be the same as the display mode. When running 4:3 games using your native 16:9 display mode—such as when running old PC games
through the dgvoodoo2 wrapper—the border will not have the correct aspect ratio. 4:3 games running through Proton or wine with the fshack patchset is untested,
but will probably exhibit the same behavior. Allowing the user to scale the border to 4:3 is on the todo list.


## Supported versions

Currently, this only supports Gnome 41. If someone tests with an earlier version and finds it still working, I'll add that version to the metadata.json.


## Games Tested Working

* House of the Dead 2 (PC version running in Wine)
* Mad Bullets (Steam/Proton)
* Supermodel Emulator (native Linux application)


## Games Confirmed Not Working

* House of the Dead (PC version running in Wine. Border shows up. Issues are probably not related to the extension)
