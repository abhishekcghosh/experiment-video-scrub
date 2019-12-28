(async () => {
    startProgress();

    const videoContainer = document.querySelector('#canvas-container');
    const framesUrlElement = document.querySelector('input[name="frames-url"]');
    if (!videoContainer || !framesUrlElement) {
        throw new Error('Element missing!');
    }

    const framesUrlPattern = framesUrlElement.value;
    const framesUrlStart = parseInt(framesUrlElement.dataset.frameStart, 10);
    const framesUrlEnd = parseInt(framesUrlElement.dataset.frameEnd, 10);
    const framesIdPadding = parseInt(framesUrlElement.dataset.frameIdPadding, 10);

    log(`Initializing frames download...`);

    log(`Please be patient. Downloaing ${framesUrlEnd} frames...`);

    const startTime = Date.now();

    const frames = await FrameUnpacker.unpack({
        urlPattern: framesUrlPattern,
        start: framesUrlStart,
        end: framesUrlEnd,
        padding: framesIdPadding
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
