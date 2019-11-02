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
        videoElement.src = videoUrl;

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

        // create a canvas to paint and extract frames from video timestamps
        const canvasElement = document.createElement('canvas');
        canvasElement.width = width;
        canvasElement.height = height;
        const context = canvasElement.getContext('2d');

        for (let step = 0; step <= duration; step += timeStep) {
            // progress video to desired timestamp
            videoElement.currentTime = step;

            // wait for successful seek
            await waitForSeeked(videoElement);

            // paint and extract out a frame for the timestamp
            context.drawImage(videoElement, 0, 0, width, height);
            const imageData = context.getImageData(0, 0, width, height);

            // and collect it in the list of our frames
            frames.push(imageData);
        }

        return frames;
    };

    return {
        unpack: unpack
    };
})();
