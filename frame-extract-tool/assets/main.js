(async () => {
    const formElement = document.getElementById('video-form');
    const framesProgress = document.getElementById('frames-progress');
    // framesProgress.style.visibility = 'none';

    const disableInput = () => {
        formElement.style.pointerEvents = 'none';
        formElement.style.opacity = 0.5;
        // framesProgress.style.display = 'block';
    };

    const enableInput = () => {
        formElement.style.pointerEvents = '';
        formElement.style.opacity = 1;
        // framesProgress.style.display = 'none';
    };

    const updateProgress = (progressElement, value) => {
        progressElement.value = value;
    };

    const getValidatedFormData = () => {
        const fileElement = document.getElementById('video-file');
        const extractByElement = formElement.querySelector('#extract-by');
        const extractCountElement = formElement.querySelector('#extract-count');

        if (!fileElement || !extractByElement || !extractCountElement) {
            throw new Error('Required input elements missing!');
        }

        if (fileElement.files.length !== 1) {
            throw new Error('Video input missing!');
        }

        const extractBy = extractByElement.value;
        if (extractBy !== 'rate' && extractBy !== 'count') {
            throw new Error('Invalid extract by mode! Please choose "frame rate" or "frame count".');
        }

        const extractCount = Math.floor(parseInt(extractCountElement.value, 10));
        if (
            !(
                (extractBy === 'rate' && extractCount >= 1 && extractCount <= 60) ||
                (extractBy === 'count' && extractCount >= 1 && extractCount <= 3600)
            )
        ) {
            throw new Error('Invalid value in Step #3! Please provide correct value as instructed.');
        }

        return {
            videoFile: fileElement.files[0],
            extractBy: extractBy,
            extractCount: extractCount
        };
    };

    const loadVideoFile = async file => {
        return new Promise(resolve => {
            const fileReader = new FileReader();
            fileReader.onloadend = e => {
                resolve(e.target.result);
            };
            fileReader.readAsDataURL(file);
        });
    };

    const extractFrames = async () => {
        log(`\nValidating inputs...`);

        const formData = getValidatedFormData();

        log(`Loading video...`);

        const videoFile = formData.videoFile;
        const videoDataURI = await loadVideoFile(videoFile);

        log(`Extracting frames. This may take some time...`);

        const unpacked = await FrameUnpacker.unpack({
            url: videoDataURI,
            by: formData.extractBy,
            count: formData.extractCount,
            progress: value => {
                updateProgress(framesProgress, value);
            }
        });

        log(`Total frames extracted: ${unpacked.meta.count}`);
        log(`Average extraction time per frame: ${unpacked.meta.avgTime}ms`);

        return unpacked.frames;
    };

    const zipAndDownload = async (fileBlobs, fileNamePattern, zipFileName) => {
        log(`Creating a zip file with frames. This may take some time. PLEASE WAIT...`);

        const zip = new JSZip();

        const padCount = fileBlobs.length.toString().length;

        fileBlobs.forEach((fileBlob, index) => {
            zip.file(fileNamePattern.replace('{{id}}', (index + 1).toString().padStart(padCount, '0')), fileBlob);
        });

        zip.generateAsync({ type: 'blob' }).then(function(zipContent) {
            log(`Triggering zip file download...`);

            saveAs(zipContent, `${zipFileName}.zip`);

            log(`Done!`);
        });
    };

    formElement.addEventListener('submit', async e => {
        e.preventDefault();

        try {
            disableInput();
            updateProgress(framesProgress, 0);

            const frames = await extractFrames();

            await zipAndDownload(frames, 'frame-{{id}}.jpg', 'extracted-frames');
        } catch (err) {
            log(err);
        } finally {
            enableInput();
            updateProgress(framesProgress, 0);
        }
    });
})();
