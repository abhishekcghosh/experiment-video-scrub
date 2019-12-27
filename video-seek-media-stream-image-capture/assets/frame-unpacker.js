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
        const timeStep = duration / frameCount;

        // get stream and setup image capture
        const videoStream = videoElement.captureStream();
        const [videoTrack] = videoStream.getVideoTracks();
        const imageCapture = new ImageCapture(videoTrack);

        // seek to beginning and wait for it to be ready in that state
        videoElement.currentTime = 0;
        await waitForSeeked(videoElement);

        // metrics
        const frameExtractTimings = [];

        for (let step = 0; step <= duration; step += timeStep) {
            // progress video to desired timestamp
            // console.log(step);
            videoElement.currentTime = step;

            // wait for successful seek
            await waitForSeeked(videoElement);

            // paint and extract out a frame for the timestamp
            let extractTimeStart = performance.now();
            const imageBitmap = await imageCapture.grabFrame();
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
