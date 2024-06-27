document.getElementById('extractFrames').addEventListener('click', function() {
    const videoFile = document.getElementById('videoFile').files[0];
    if (videoFile) {
        extractFramesFromVideo(videoFile);
    } else {
        alert('Por favor, selecione um arquivo de vídeo.');
    }
});

function extractFramesFromVideo(file) {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const zip = new JSZip();

    const url = URL.createObjectURL(file);
    video.src = url;

    video.addEventListener('loadedmetadata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        video.currentTime = 0;
    });

    video.addEventListener('seeked', captureFrame);

    function captureFrame() {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
            const frameNumber = Math.floor(video.currentTime * video.fps);
            zip.file(`frame-${frameNumber}.png`, blob);

            if (video.currentTime < video.duration) {
                video.currentTime += 1 / video.fps; // Avança para o próximo frame
            } else {
                video.removeEventListener('seeked', captureFrame);
                zip.generateAsync({ type: 'blob' }).then((content) => {
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(content);
                    a.download = 'frames.zip';
                    a.click();
                    URL.revokeObjectURL(url);
                });
            }
        }, 'image/png');
    }
}
