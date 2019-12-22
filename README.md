# experiment-video-scrub

Experiments with video scrubbing on the web.

We try out two basic mechanisms of downloading a video on the page on a browser and then attempting
to scrub it with input signals such as the scrolling of the page in this example.

See it in action: https://video-scrub.playground.ghosh.dev/

## Local Development

I have been simply using [VSCode Live Server](https://github.com/ritwickdey/vscode-live-server) for local development.

## Deploy

The github repository deploys to [Netlify](https://app.netlify.com/sites/experiment-video-scrub/overview) from the `master` branch.

## Approaches

#### #1: video-current-time

This mechanism simply loads the video in a HTML5 `video` tag and attempts to set the `currentTime`
property of the loaded video in an attempt to scrub it when scrolling.

This somewhat works out on high end devices especially with low quality videos. But can't be
trusted, atleast definitely not on mobile browsers. Rule of thumb, the browser does a lot of
intelligent things to adjust the how and when of video seeking and painting the corresponding frame.
This is probably the most naive (and stupidest) way.

#### #2: video-play-unpack-frames-canvas

This mechanism simply downloads the video in an in-memory HTML5 `video` tag, and unpacks video
frames from it by starting to `play` the video and then listening to regular `timeupdate` event on
the video element to be fired, at which point it `pauses` the video to grab a frame by painting the
outcome on an `OffscreenCanvas` element and collecting the canvas' 2D context `imageData` (pixels
that represent the frame). When done, it `plays` the video again, and the loop continues till the
video has been played to the end.

Imagine this to be generating a set of image files from the original source video we we do this
generation in the browser directly using an `OffscreenCanvas`. We could do this with a normal `canvas`
element as well, but not a great reason to do that.

Once that is done, for scrubbing, we figure out the correct frame to paint based on the input signal
(scroll position in this example) and then paint the correct frame on a _visible_ `canvas` element's
2D context on the page.

This is not as elegant as we may initially think. Of course, the time to extract out the frames is
lower-bound by the duration of the video but overall it takes much more time due to so much amount
of javascript work happening.

#### #3: video-seek-unpack-frames-canvas

Very similar to `video-play-unpack-frames-canvas`, this also downloads the video in an in-memory HTML5
`video` tag, but unpacks video frames from it by _seeking_ through the video at regular intervals
and painting the outcome on a `OffscreenCanvas` element and collecting the canvas' 2D context
`imageData` (pixels that represent the frame). A predefined number of frames are unpacked.

Once that is done, for scrubbing, we figure out the correct frame to paint based on the input signal
(scroll position in this example) and then paint the correct frame on a _visible_ `canvas` element's
2D context on the page.

Thus, it brings some improvements over `video-play-unpack-frames-canvas` - much faster due to seek rather
than play (not being bound to video `duration`), and with a bit more control on the number of frames
and perhaps hopefully cheaper in comparison.
