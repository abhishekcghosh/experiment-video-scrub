(async () => {
    startProgress();

    const videoContainer = document.querySelector('#canvas-container');
    const videoUrlElement = document.querySelector('input[name="video-url"]');
    if (!videoContainer || !videoUrlElement) {
        throw new Error('Element missing!');
    }

    const videoUrl = videoUrlElement.value;
    const frameCount = videoUrlElement.dataset.frames;

    log(`Initializing video: ${videoUrl}`);

    log(`Please be patient. Unpacking ${frameCount} frames...`);

    const startTime = Date.now();

    const frames = await FrameUnpacker.unpack({
        url: videoUrl,
        frames: frameCount
    });

    const endTime = Date.now();

    log(`Took ${(endTime - startTime) / 1000} seconds.`);

    log('Painting canvas with first frame...');

    const canvas = document.createElement('canvas');
    canvas.classList.add('canvas');
    canvas.height = frames[0].height;
    canvas.width = frames[0].width;
    const context = canvas.getContext('2d');
    context.drawImage(frames[0], 0, 0);

    videoContainer.appendChild(canvas);

    log('Setting up scrubber...');

    const observer = CanvasFrameScrubber.create(context, frames);

    const observable = new ScrollObservable();
    observable.subscribe(observer);

    log('Ready! Scroll to scrub.');

    stopProgress();
})();
