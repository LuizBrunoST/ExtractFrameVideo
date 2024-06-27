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

    const frameInterval = 1000 / video.fps; // Intervalo em milissegundos
    let currentTime = 0;
    let frameCount = 0;

    function captureFrame() {
        if (currentTime >= video.duration * 1000) {
            // Quando terminar, gera o ZIP e faz o download
            video.pause();
            zip.generateAsync({ type: 'blob' }).then((content) => {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(content);
                a.download = 'frames.zip';
                a.click();
                URL.revokeObjectURL(url);
            });
            return;
        }

        video.currentTime = currentTime / 1000; // Converte milissegundos para segundos
        video.addEventListener('seeked', function onSeeked() {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
                zip.file(`frame-${frameCount.toString().padStart(4, '0')}.png`, blob);
                frameCount++;
                currentTime += frameInterval;
                video.removeEventListener('seeked', onSeeked);
                captureFrame(); // Captura o próximo frame
            }, 'image/png', 1);
        }, { once: true });
    }
    
    captureFrame();
}
