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

    const waitForSeeked = async videoElement => {
        return new Promise(resolve => {
            const handler = () => {
                videoElement.removeEventListener('seeked', handler);
                resolve();
            };
            videoElement.addEventListener('seeked', handler);
        });
    };

    const unpack = async options => {
        const videoUrl = options.url,
            frameCount = options.frames;

        const frames = [];

        // load the video in a video element
        const videoElement = document.createElement('video');
        videoElement.crossOrigin = 'Anonymous';
        videoElement.src = videoUrl;
        videoElement.muted = true; // important for autoplay

        // wait for it to be ready for processing
        await waitForCanPlayThrough(videoElement);

        // obtain basic parameters
        const duration = videoElement.duration;
        const width = videoElement.videoWidth;
        const height = videoElement.videoHeight;
        const timeStep = duration / frameCount;

        // seek to beginning and wait for it to be ready in that state
        videoElement.currentTime = 0;
        await waitForSeeked(videoElement);

        // create an offscreen canvas to paint and extract frames from video timestamps
        const canvasElement = new OffscreenCanvas(width, height);
        const context = canvasElement.getContext('2d');

        // metrics
        const frameExtractTimings = [];

        for (let step = 0; step <= duration; step += timeStep) {
            // progress video to desired timestamp
            videoElement.currentTime = step;

            // wait for successful seek
            await waitForSeeked(videoElement);

            // paint and extract out a frame for the timestamp
            const extractTimeStart = performance.now();
            context.drawImage(videoElement, 0, 0, width, height);
            const imageData = context.getImageData(0, 0, width, height);
            const imageBitmap = await createImageBitmap(imageData);
            frameExtractTimings.push(performance.now() - extractTimeStart);

            // and collect it in the list of our frames
            frames.push(imageBitmap);
        }

        log(`Average extraction time per frame: ${average(frameExtractTimings)}ms`);

        return frames;
    };

    return {
        unpack: unpack
    };
})();
