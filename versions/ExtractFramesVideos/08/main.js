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
    const statusMessage = document.getElementById('statusMessage');
    const progressBar = document.getElementById('progressBar');

    video.addEventListener('loadedmetadata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        video.play();
        startCapturingFrames();
    });

    function startCapturingFrames() {
        const durationInMs = video.duration * 1000;
        const fps = 30; // Definido a taxa de quadros, ajuste conforme necessário
        const frameInterval = 1000 / fps;
        let currentTime = 0;
        let frameCount = 0;

        function captureFrame() {
            if (currentTime >= durationInMs) {
                // Quando terminar, gera o ZIP e faz o download
                video.pause();
                statusMessage.textContent = 'Captura de frames concluída. Gerando arquivo ZIP...';
                zip.generateAsync({ type: 'blob' }).then((content) => {
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(content);
                    a.download = 'frames.zip';
                    a.click();
                    URL.revokeObjectURL(url);
                    statusMessage.textContent = 'Download concluído.';
                });
                return;
            }

            video.currentTime = currentTime / 1000; // Convertendo milissegundos para segundos
            video.addEventListener('seeked', function onSeeked() {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                canvas.toBlob((blob) => {
                    zip.file(`frame-${frameCount.toString().padStart(4, '0')}.png`, blob);
                    frameCount++;
                    currentTime += frameInterval;
                    const progress = (frameCount / (durationInMs / frameInterval)) * 100;
                    progressBar.value = progress;
                    statusMessage.textContent = `Capturando frames: ${frameCount} de ${Math.floor(durationInMs / frameInterval)}`;
                    video.removeEventListener('seeked', onSeeked);
                    captureFrame();
                }, 'image/png');
            }, { once: true });
        }
        
        captureFrame();
    }
}
