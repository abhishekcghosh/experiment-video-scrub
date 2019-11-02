# experiment-video-scrub

Experiments with video scrubbing on the web.

We try out two basic mechanisms of downloading a video on the page on a browser and then attempting
to scrub it with input signals such as the scrolling of the page in this example.

See it in action: https://video-scrub.playground.ghosh.dev/

## Approaches

#### #1: video-current-time

This mechanism simply loads the video in a HTML5 `<video>` tag and attempts to set the `currentTime`
property of the loaded video in an attempt to scrub it when scrolling.

#### #2: canvas-unpacked-frames

This mechanism simply downloads the video in an in-memory HTML5 `<video>` tag, and unpacks video
frames from it by seeking through the video at regular intervals and painting the outcome on a
hidden `<canvas>` element and collecting the canvas' 2D context `imageData` (pixels that represent
the frame).

Imagine this to be generating a set of image files from the original source video. In this example,
we do this generation of the list of images in browser directly using a `<canvas>` element.

Once that is done, for scrubbing, we figure out the correct frame to paint based on the input signal
(scroll position in this example) and then paint the correct frame on a visible `<canvas>` element's
2D context on the page.

## Observations

TBA
