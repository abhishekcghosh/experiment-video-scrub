const FrameUnpacker = (() => {
    const waitForCanPlayThrough = async videoElement => {
        return new Promise(resolve => {
            const handler = () => {
                videoElement.removeEventListener('canplaythrough', handler);
                resolve();
            };

            videoElement.addEventListener('canplaythrough', handler);
        });
    };

    const unpack = async options => {
        const videoUrl = options.url;

        const frames = [];

        // load the video in a video element
        const videoElement = document.createElement('video');
        videoElement.crossOrigin = 'Anonymous';
        videoElement.src = videoUrl;
        videoElement.muted = true; // important for autoplay

        // wait for it to be ready for processing
        await waitForCanPlayThrough(videoElement);

        // obtain basic parameters
        log(`Video duration is: ${videoElement.duration} seconds`);

        const width = videoElement.videoWidth;
        const height = videoElement.videoHeight;

        // create an offscreen canvas to paint and extract frames from video timestamps
        const canvasElement = new OffscreenCanvas(width, height);
        const context = canvasElement.getContext('2d');

        return new Promise(resolve => {
            let lastCurrentTime = 0;

            videoElement.addEventListener('timeupdate', e => {
                requestAnimationFrame(async () => {
                    // debounce a bit more... don't extract too many frames which will bloat up
                    // memory and will be useless for scrubbing due to too much work
                    if (videoElement.currentTime - lastCurrentTime <= 0.01) {
                        return;
                    }
                    lastCurrentTime = videoElement.currentTime;

                    videoElement.pause();

                    // paint and extract out a frame for the timestamp
                    context.drawImage(videoElement, 0, 0, width, height);
                    const imageData = context.getImageData(0, 0, width, height);
                    const imageBitmap = await createImageBitmap(imageData);

                    // and collect it in the list of our frames
                    frames.push(imageBitmap);

                    if (videoElement.currentTime < videoElement.duration) {
                        // go on...
                        videoElement.play();
                    } else {
                        // we're done...
                        resolve(frames);
                    }
                });
            });

            videoElement.play();
        });
    };

    return {
        unpack: unpack
    };
})();
