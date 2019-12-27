const FrameUnpacker = (() => {
    const unpack = async options => {
        const urlPattern = options.urlPattern,
            start = options.start,
            end = options.end,
            padding = options.padding;

        const bitmaps = [];
        const calls = [];

        const timeStart = performance.now();

        // download each frame image and prep it up
        for (let index = start; index <= end; index++) {
            const id = index.toString().padStart(padding, '0');
            const url = urlPattern.replace('{{id}}', id);

            calls.push(
                fetch(url).then(res =>
                    res
                        .blob()
                        .then(blob =>
                            createImageBitmap(blob).then(bitmap => bitmaps.push({ id: index, bitmap: bitmap }))
                        )
                )
            );
        }

        // wait for all the downloads to finish... (a more eager implementation that starts putting
        // the scrubbing as soon as the first few frames are downloaded can also be done, but we'll
        // keep thing s simple for now)
        await Promise.all(calls);

        // sort the downloaded frame bitmaps in order, they could have been downloaded haphazardly
        bitmaps.sort((a, b) => {
            return a.id - b.id;
        });

        // once that's done, construct an array of just frames that would be returned
        const frames = [];
        bitmaps.map(bitmap => frames.push(bitmap.bitmap));

        const timeDelta = performance.now() - timeStart;
        log(`Average extraction time per frame: ${timeDelta / (end - start)}ms`);

        return frames;
    };

    return {
        unpack: unpack
    };
})();
