# experiment-video-scrub

Experiments with video scrubbing on the web.

We try out two basic mechanisms of downloading a video on the page on a browser and then attempting
to scrub it with input signals such as the scrolling of the page in this example.

See it in action: https://video-scrub.playground.ghosh.dev/

## Local Development

I have been simply using [VSCode Live Server](https://github.com/ritwickdey/vscode-live-server) for local development.

## Deploy

The github repository deploys to [Netlify](https://app.netlify.com/sites/experiment-video-scrub/overview) from the `master` branch.

## Video Source Attribution

Sample video is picked up from [public test video sources](https://gist.github.com/jsturgis/3b19447b304616f18657). All copyrights belong to the original owners.

## Approaches

#### #1: video-current-time

This mechanism simply loads the video in a HTML5 `video` tag and attempts to set the `currentTime`
property of the loaded video in an attempt to scrub it when scrolling.

This somewhat works out on high end devices especially with low quality videos. But can't be
trusted, atleast definitely not on mobile browsers. Rule of thumb, the browser does a lot of
intelligent things to adjust the how and when of video seeking and painting the corresponding frame.
This is probably the most naive (and stupidest) way.

#### #2: video-play-unpack-frames-canvas

This mechanism simply downloads the video in an HTML5 `video` tag, and unpacks video frames from it
by starting to `play` the video and then listening to regular `timeupdate` event on the video
element to be fired, at which point it `pauses` the video to grab a frame by painting the outcome on
an `OffscreenCanvas` element and collecting the frame's image bitmap from canvas' 2D context. When
done, it `plays` the video again, and the loop continues till the video has been played to the end.

Imagine this to be generating a set of image files from the original source video we we do this
generation in the browser directly using an `OffscreenCanvas`. We could do this with a normal `canvas`
element as well, but not a great reason to do that.

Once that is done, for scrubbing, we figure out the correct frame to paint based on the input signal
(scroll position in this example) and then draw the correct frame on a _visible_ `canvas` element's
2D context on the page.

This is not as elegant as we may initially think. Of course, the time to extract out the frames is
lower-bound by the duration of the video but overall it takes much more time due to so much amount
of javascript work happening.

#### #3: video-seek-unpack-frames-canvas

Very similar to `video-play-unpack-frames-canvas`, this also downloads the video in an HTML5 `video`
tag, but unpacks video frames from it by _seeking_ through the video at regular intervals and
painting the outcome on a `OffscreenCanvas` element and collecting the frame's image bitmap from
canvas' 2D context. A predefined number of frames are unpacked.

Once that is done, for scrubbing, we figure out the correct frame to paint based on the input signal
(scroll position in this example) and then draw the correct frame on a _visible_ `canvas` element's
2D context on the page.

Thus, it brings some improvements over `video-play-unpack-frames-canvas` - much faster due to seek rather
than play (not being bound to video `duration`), and with a bit more control on the number of frames
and perhaps hopefully cheaper in comparison.

#### #4: video-seek-media-stream-image-capture

Largely similar to above approach of `video-seek-unpack-frames-canvas` in terms of seeking through
the video using a HTML5 `video` tag, but instead of pausing and drawing it on a canvas context to
extract out the frame's image bitmap data, we use
[`captureStream()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/captureStream)
on the `video` element to capture the video stream and then we use the captured stream's
[`ImageCapture`](https://developer.mozilla.org/en-US/docs/Web/API/ImageCapture) interface to grab
the image bitmap data of a frame at a desired point in time.

Once that is done, for scrubbing, we follow the exact same approach as above.

While this approach originally seemed relatively a bit elegant conceptually, to use the MediaStream
APIs, in reality this turned out to be way slower performance wise, often taking as much as more
than double the time in extracting a frame compared to directly drawing the video element in a
Offscreen canvas' 2D context and extracting out the image bitmap from it :(

#### #5: video-server-frames

TBA

#### #6: video-wasm-ffmpeg-extract

Definitely an idea to pursue, although I haven't yet been able to test this in action.

TBA
