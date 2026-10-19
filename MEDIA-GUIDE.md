# Expertise carousel

Open index.html with the accompanying files and assets folder in place. This review copy changes the Expertise section only. The original project files are unchanged.

- Swipe or use a trackpad, arrow buttons, or dot controls.
- Focus the scroll area and use Left/Right, Home or End.
- The carousel does not advance automatically.

Edit service-media.js to change the four cards' visuals:

```js
{ type: 'image', src: 'assets/photo.avif', alt: 'Describe the image' }
{ type: 'gif', src: 'assets/clip.gif', poster: 'assets/still.avif', alt: 'Describe the scene' }
{ type: 'video', src: 'assets/clip.mp4', poster: 'assets/still.avif', alt: 'Describe the video' }
{ type: 'animation' }
```

Put the matching files in assets/. Video has native play controls, does not autoplay, and pauses when its card is left. Use short, silent clips for decorative service imagery. If using spoken information, add captions via a track element. GIFs should be short, finite animations; supply a poster so reduced-motion users receive a still. The built-in animation is a decorative house-lighting illustration and stops animating under reduced-motion preferences.

The three default images are existing gallery assets, not newly verified photographs of each service. Replace them with service-specific media when ready.

Validation: JavaScript syntax and local asset references checked. A browser preview could not be served in this sandbox, so visual behaviour on real phone and desktop browsers remains to be reviewed. No public deployment was made.
