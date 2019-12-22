const CanvasFrameScrubber = (() => {
    const create = (context, frames) => {
        let currentFrame = 0;

        const observer = {
            next: percentage => {
                const frameIndex = Math.floor((percentage * (frames.length - 1)) / 100);

                if (currentFrame === frameIndex) return;

                window.requestAnimationFrame(() => {
                    context.drawImage(frames[frameIndex], 0, 0);
                });
            }
        };

        return observer;
    };

    return {
        create: create
    };
})();
