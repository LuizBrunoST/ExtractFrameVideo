const video = document.getElementById('video');
const inicioLoopInput = document.getElementById('inicio-loop');
const fimLoopInput = document.getElementById('fim-loop');
let loopInterval;

function repetir() {
    const inicioLoop = parseInt(inicioLoopInput.value);
    const fimLoop = parseInt(fimLoopInput.value);

    if (!isNaN(inicioLoop) && !isNaN(fimLoop) && fimLoop > inicioLoop && video.src) {
        video.currentTime = inicioLoop; // Define o vídeo para iniciar do tempo inicial do loop

        clearInterval(loopInterval); // Limpa o intervalo anterior, se houver

        loopInterval = setInterval(() => {
            if (video.currentTime >= fimLoop) {
                video.currentTime = inicioLoop; // Volta para o início do loop se atingir o tempo final
            }
        }, 100); // Verifica a cada 100ms se o vídeo atingiu o tempo final do loop
    }
}

// Event listener para carregar o vídeo selecionado
document.getElementById('video-file').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const objectURL = URL.createObjectURL(file);
    video.src = objectURL;
});