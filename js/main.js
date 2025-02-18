//toast.exibir('erro', 'Erro!', 'Mensagem de erro.');
//toast.exibir('sucesso', 'Sucesso!', 'Mensagem de sucesso.');
//toast.exibir('atencao', 'Atenção!', 'Mensagem de atenção.');
//toast.exibir('', '', 'Mensagem em branco.');

const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const date = new Date();
let mes = month[date.getUTCMonth()];
let dateFullDownload = date.getDate() + "-" + mes + "-" + date.getFullYear() + "_" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds();

const videoForm = document.getElementById('video-form');
const videoInput = document.getElementById('video-input');
const videoElement = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const timeline = document.getElementById('timeline');
const imageList = document.getElementById('image-list');
let imageIndex = 0;

//buttom video
var btnPlay = document.getElementById('btn-play');
var btnPause = document.getElementById('btn-pause');
var btnForward = document.getElementById('btn-forward');
var btnBackward = document.getElementById('btn-backward');
var btnFullScreen = document.getElementById('btn-fullScreen');

btnPlay.addEventListener('click', function() {
    videoElement.play();
    btnPlay.style.display = 'none';
    btnPause.style.display = 'inline';
});

btnPause.addEventListener('click', function() {
    videoElement.pause();
    btnPlay.style.display = 'inline';
    btnPause.style.display = 'none';
});

btnForward.addEventListener('click', function() {
    videoElement.currentTime += 0.1; // Avançar 100 milesegundos
});

  btnBackward.addEventListener('click', function() {
    videoElement.currentTime -= 0.1; // Retroceder 100 milesegundos
});

btnFullScreen.addEventListener('click', function() {
    if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
    } else if (videoElement.mozRequestFullScreen) { // Firefox
        videoElement.mozRequestFullScreen();
    } else if (videoElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
        videoElement.webkitRequestFullscreen();
    } else if (videoElement.msRequestFullscreen) { // IE/Edge
        videoElement.msRequestFullscreen();
    }
});

videoElement.addEventListener('timeupdate', function () {
    timeline.value = videoElement.currentTime;
});

timeline.addEventListener('input', function () {
    videoElement.currentTime = timeline.value;
});

videoForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const file = videoInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            videoElement.src = reader.result;
        }
    }
});

videoElement.addEventListener('loadedmetadata', function () {
    timeline.max = videoElement.duration;
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    canvas.style.display = 'none';
});

function captureFrame() {
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const imageURL = canvas.toDataURL();
    const listItem = document.createElement('li');
    const image = document.createElement('img');
    image.className = 'w3-round-xlarge';
    image.style.width = '100%';
    image.src = imageURL;
    listItem.appendChild(image);
    const downloadButton = document.createElement('button');
    downloadButton.className = 'w3-button w3-theme-d1 w3-block w3-hover-theme';
    downloadButton.innerHTML = '<i class="fa-solid fa-download"></i> Download';
    downloadButton.addEventListener('click', function () {
        downloadImage(imageURL);
    });
    listItem.className = 'w3-col s6';
    listItem.appendChild(downloadButton);
    imageList.appendChild(listItem);
    imageList.scrollTop = imageList.scrollHeight;
}

function downloadImage(url) {
    const link = document.createElement('a');
    link.href = url;
    link.download = `frame_${imageIndex}_${dateFullDownload}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.exibir('sucesso', 'Sucess!', `Download <b>frame_${imageIndex}_${dateFullDownload}</b> completed successfully.`);
}

const extractButton = document.createElement('button');
extractButton.innerHTML = '<i class="fa-solid fa-camera"></i> Extract Frame';
extractButton.className = 'w3-button w3-theme-d1 w3-block w3-hover-theme';
extractButton.addEventListener('click', function () {
    captureFrame();
    toast.exibir('sucesso', 'Sucess!', 'frame extracted successfully.');
});
$('#objeto-video').append(extractButton);

const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');
videoElement.addEventListener('loadedmetadata', () => {
    durationDisplay.innerText = formatTime(videoElement.duration);
});

videoElement.addEventListener('timeupdate', () => {
    currentTimeDisplay.innerText = formatTime(videoElement.currentTime);
});

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
}


//Extract Automatic
document.getElementById('extractFrames').addEventListener('click', function() {
    const videoInput = document.getElementById('video-input').files[0];
    if (videoInput) {
        extractFramesFromVideo(videoInput);
    } else {
        toast.exibir('erro', 'Error!', `Please select a video file.`);
    }
});

function extractFramesFromVideo(file) {
    const canvasAutomatic = document.getElementById('canvasAutomatic');
    const context = canvasAutomatic.getContext('2d');
    const zip = new JSZip();
    
    const url = URL.createObjectURL(file);
    videoElement.src = url;
    const statusMessage = document.getElementById('statusMessage');
    const progressBar = document.getElementById('progressBar');

    videoElement.addEventListener('loadedmetadata', () => {
        canvasAutomatic.width = videoElement.videoWidth;
        canvasAutomatic.height = videoElement.videoHeight;

        videoElement.play();
        startCapturingFrames();
    });

    function startCapturingFrames() {
        const durationInMs = videoElement.duration * 1000;
        const fps = 30; // Definido a taxa de quadros, ajuste conforme necessário
        const frameInterval = 1000 / fps;
        let currentTime = 0;
        let frameCount = 0;

        function captureFrame() {
            if (currentTime >= durationInMs) {
                // Quando terminar, gera o ZIP e faz o download
                videoElement.pause();
                statusMessage.textContent = 'Frame capture completed. Generating ZIP file...';
                toast.exibir('sucesso', 'Sucess!', `Frame capture completed. Generating ZIP file...`);
                generateZip().then(() => {
                    statusMessage.textContent = 'Download completed.';
                    toast.exibir('sucesso', 'Sucess!', `Download completed successfully.`);
                });
                return;
            }

            videoElement.currentTime = currentTime / 1000; // Convertendo milissegundos para segundos
            videoElement.addEventListener('seeked', function onSeeked() {
                context.drawImage(videoElement, 0, 0, canvasAutomatic.width, canvasAutomatic.height);
                canvasAutomatic.toBlob((blob) => {
                    zip.file(`frame-${frameCount.toString().padStart(4, '0')}.png`, blob);
                    frameCount++;
                    currentTime += frameInterval;
                    const progress = (frameCount / (durationInMs / frameInterval)) * 100;
                    progressBar.style.width = progress+'%';
                    statusMessage.textContent = `Capturing frames: ${frameCount} out of ${Math.floor(durationInMs / frameInterval)}`;
                    videoElement.removeEventListener('seeked', onSeeked);
                    captureFrame();
                }, 'image/png');
            }, { once: true });
        }
        
        captureFrame();
    }

    function generateZip() {
        return zip.generateAsync({ type: 'blob' }, (metadata) => {
            const progress = metadata.percent;
            progressBar.style.width = progress+'%';
            statusMessage.textContent = `Compressing frames: ${Math.round(progress * 100)}% concluded`;
        }).then((content) => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(content);
            a.download = `frames_${dateFullDownload}.zip`;
            a.click();
            URL.revokeObjectURL(url);
        });
    }
}

$(document).ready(function () {
    // Função para realizar a requisição AJAX e atualizar a div com o conteúdo da resposta
    function ajax(url, divClass) {
        $.ajax({
            url: url,
            type: 'GET',
            success: function (response) {
                // Atualiza a div com o conteúdo da resposta
                $(divClass).html(response);
            }
        });
    }

    // Função para carregar os anúncios
    function loadAds() {
        // Array de URLs e classes de div correspondentes
        var urls = [
            {
                url: 'https://lumamax.com.br/api/sdkAds/ads?id_usuario=1&site=8&id_bloco=20',
                divClass: '.adMax1'
            },
            {
                url: 'https://lumamax.com.br/api/sdkAds/ads?id_usuario=1&site=8&id_bloco=20',
                divClass: '.adMax2'
            }
            // Adicione mais objetos URL/divClass conforme necessário
        ];

        // Percorre o array de URLs e classes de div
        for (var i = 0; i < urls.length; i++) {
            var url = urls[i].url;
            var divClass = urls[i].divClass;

            // Chama a função ajax() para cada URL e classe de div correspondente
            ajax(url, divClass);
        }
    }

    // Função principal que é executada quando o documento estiver pronto
    $(document).ready(function () {
        // Chama a função loadAds() para carregar os anúncios
        loadAds();
        let intervalAnuncios = setInterval(() => {
            loadAds();
        }, 3000);

        setTimeout(() => {
            clearInterval(intervalAnuncios);
        }, 10000);
        
    });
});