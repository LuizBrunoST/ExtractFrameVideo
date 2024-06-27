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
    
    const url = URL.createObjectURL(file);
    video.src = url;

    video.addEventListener('loadedmetadata', () => {
        const duration = video.duration;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        video.currentTime = 0;
    });

    video.addEventListener('seeked', () => {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `frame-${video.currentTime.toFixed(2)}.png`;
            a.click();
            
            if (video.currentTime < video.duration) {
                video.currentTime += 1 / video.fps;  // Avança para o próximo frame
            } else {
                URL.revokeObjectURL(url);
            }
        }, 'image/png');
    });
    
    video.addEventListener('timeupdate', () => {
        if (video.currentTime >= video.duration) {
            video.pause();
        }
    });

    video.addEventListener('play', () => {
        video.currentTime = 0;
    });

    video.play();
}
