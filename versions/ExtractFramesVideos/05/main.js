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
        video.play();
    });

    let frameInterval = 1000 / video.fps; // Intervalo entre frames em milissegundos
    let startTime = 0;
    let endTime = video.duration * 1000; // Convertendo a duração do vídeo para milissegundos
    let currentTime = startTime;

    function captureFrame() {
        video.currentTime = currentTime / 1000; // Convertendo milissegundos para segundos
        video.addEventListener('seeked', () => {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
                const frameNumber = Math.floor(currentTime);
                zip.file(`frame-${frameNumber}.png`, blob);

                if (currentTime < endTime) {
                    currentTime += frameInterval;
                    video.removeEventListener('seeked', captureFrame);
                    captureFrame(); // Recursivamente captura o próximo frame
                } else {
                    video.pause();
                    zip.generateAsync({ type: 'blob' }).then((content) => {
                        const a = document.createElement('a');
                        a.href = URL.createObjectURL(content);
                        a.download = 'frames.zip';
                        a.click();
                        URL.revokeObjectURL(url);
                    });
                }
            }, 'image/png');
        }, { once: true });
    }
    
    captureFrame();
}
