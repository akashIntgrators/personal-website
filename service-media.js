/* Per-card media: type = image, gif, video, or animation.
   Use local assets. Video: supply src (MP4/WebM) and poster (still image).
   GIF: supply src plus poster for people who prefer reduced motion.
   Animation: the built-in CSS house illustration; no external libraries. */
window.expertiseMedia = [
  { type: 'image', src: 'assets/project-wide-1.avif', alt: 'Home design from the project gallery' },
  { type: 'image', src: 'assets/project-wide-2.avif', alt: 'Building design from the project gallery' },
  { type: 'image', src: 'assets/project-wide-3.avif', alt: 'Residential design from the project gallery' },
  { type: 'animation' }
];
