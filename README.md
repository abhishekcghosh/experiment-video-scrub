# experiment-video-scrub

A collection of proof-of-concepts and prototypes of various mechanisms to enable video scrubbing based experiences on the web with input signals such as the scrolling of the page.

## Approaches & Demos

Read about approaches, observations and learnings in detail on my [blog post](https://ghosh.dev/posts/playing-with-video-scrubbing-animations-on-the-web/).

#### #1: video-current-time: ([blog](https://www.ghosh.dev/posts/playing-with-video-scrubbing-animations-on-the-web/#1-video-current-time-demo)) ([demo](https://video-scrub.playground.ghosh.dev/video-current-time/))

#### #2: video-play-unpack-frames-canvas ([blog](https://www.ghosh.dev/posts/playing-with-video-scrubbing-animations-on-the-web/#2-video-play-unpack-frames-canvas-demo)) ([demo](https://video-scrub.playground.ghosh.dev/video-play-unpack-frames-canvas/))

#### #3: video-seek-unpack-frames-canvas ([blog](https://www.ghosh.dev/posts/playing-with-video-scrubbing-animations-on-the-web/#3-video-seek-unpack-frames-canvas-demo)) ([demo](https://video-scrub.playground.ghosh.dev/video-seek-unpack-frames-canvas/))

#### #4: video-seek-media-stream-image-capture ([blog](https://www.ghosh.dev/posts/playing-with-video-scrubbing-animations-on-the-web/#4-video-seek-media-stream-image-capture-demo)) ([demo](https://video-scrub.playground.ghosh.dev/video-seek-media-stream-image-capture/))

#### #5: video-server-frames ([blog](https://www.ghosh.dev/posts/playing-with-video-scrubbing-animations-on-the-web/#5-video-server-frames-demo)) ([demo](https://video-scrub.playground.ghosh.dev/video-server-frames/))

#### #6: video-wasm-ffmpeg-extract ([blog](https://www.ghosh.dev/posts/playing-with-video-scrubbing-animations-on-the-web/#6-video-wasm-ffmpeg-extract))

## Bonus

Try out the bonus [Video Frame Extract Tool (experimental)](https://video-scrub.playground.ghosh.dev/frame-extract-tool/).

## Dev Setup

#### Local

This is purely a static website, so it doesn't need a server. For ease of development though, I have been simply using [VSCode Live Server](https://github.com/ritwickdey/vscode-live-server) for local development.

#### Deploy

The github repository deploys to [Netlify](https://app.netlify.com/sites/experiment-video-scrub/overview) from the `master` branch.

## Video Source Attribution

Sample video is picked up from [public test video sources](https://gist.github.com/jsturgis/3b19447b304616f18657). All copyrights belong to the original owners.
