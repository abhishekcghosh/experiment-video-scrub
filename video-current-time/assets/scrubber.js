const Scrubber = (function() {
    const createScrubbingObserver = video => {
        const observer = {
            next: percentage => {
                const updateTimeTo = (video.duration / 100) * percentage;

                window.requestAnimationFrame(() => {
                    video.currentTime !== updateTimeTo ? (video.currentTime = updateTimeTo) : undefined;
                });
            }
        };

        return observer;
    };

    const createScrubber = options => {
        if (!(options.video instanceof HTMLVideoElement)) {
            throw new Error(`Invalid video element`);
        }

        const video = options.video;

        return new Promise(resolve => {
            var readyToScrub = () => {
                video.currentTime = 0;
                video.pause();

                // we do this only for the first time...
                video.removeEventListener('canplaythrough', readyToScrub);

                resolve(createScrubbingObserver(video));
            };

            video.addEventListener('canplaythrough', readyToScrub);
        });
    };

    return {
        create: createScrubber
    };
})();
