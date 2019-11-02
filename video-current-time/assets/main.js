(async () => {
    log('Loading. Please wait...');

    const observer = await Scrubber.create({
        video: document.getElementById('video-1')
    });

    const observable = new ScrollObservable();
    observable.subscribe(observer);

    log('Ready! Scroll to scrub.');
})();
