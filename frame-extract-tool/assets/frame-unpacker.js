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

    const getCanvasJPEGBlob = async canvasElement => {
        return new Promise(resolve => {
            canvasElement.toBlob(
                blob => {
                    resolve(blob);
                },
                'image/jpeg',
                0.85
            );
        });
    };

    const unpack = async options => {
        const videoUrl = options.url,
            by = options.by,
            count = options.count,
            progressHook = options.progress;

        const frames = [];

        // load the video in a video element
        const videoElement = document.createElement('video');
        videoElement.crossOrigin = 'Anonymous';
        videoElement.src = videoUrl;
        videoElement.muted = true; // important for autoplay

        // wait for it to be ready for processing
        // also keep a timeout, after which this will reject... say the video is not playable
        // given that we'll load a data URI here from the caller, 3sec is a large enough time
        await withTimeout(waitForCanPlayThrough(videoElement), 3000);

        // obtain basic parameters
        const duration = videoElement.duration;
        const width = videoElement.videoWidth;
        const height = videoElement.videoHeight;
        let timeStep, frameTotal;

        // compute the time step based on extract by and extract count values
        if (by === 'rate') {
            timeStep = 1 / count;
            frameTotal = Infinity;
        } else if (by === 'count') {
            timeStep = duration / count;
            frameTotal = count;
        } else {
            throw new Error('Invalid extract by value: provide either "rate" or "count".');
        }

        // seek to beginning and wait for it to be ready in that state
        videoElement.currentTime = 0;
        await waitForSeeked(videoElement);

        // create an offscreen canvas to paint and extract frames from video timestamps
        const canvasElement = document.createElement('canvas');
        canvasElement.width = width;
        canvasElement.height = height;
        const context = canvasElement.getContext('2d');

        // metrics
        const frameExtractTimings = [];

        let frameCount = 0;
        for (let step = 0; step <= duration && frameCount < frameTotal; step += timeStep) {
            // progress video to desired timestamp
            videoElement.currentTime = step;

            // wait for successful seek
            await waitForSeeked(videoElement);

            // paint and extract out a frame for the timestamp
            const extractTimeStart = performance.now();
            context.drawImage(videoElement, 0, 0, width, height);
            //const imageData = context.getImageData(0, 0, width, height);
            const imageDataBlob = await getCanvasJPEGBlob(canvasElement);
            //const imageBitmap = await createImageBitmap(imageData);
            frameExtractTimings.push(performance.now() - extractTimeStart);

            // and collect it in the list of our frames
            frames.push(imageDataBlob);

            frameCount++;

            // update progress
            progressHook(Math.ceil((step / duration) * 100));
        }

        return {
            frames: frames,
            meta: {
                count: frames.length,
                avgTime: average(frameExtractTimings)
            }
        };
    };

    return {
        unpack: unpack
    };
})();
