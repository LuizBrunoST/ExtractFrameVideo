//toast.exibir('erro', 'Erro!', 'Mensagem de erro.');
//toast.exibir('sucesso', 'Sucesso!', 'Mensagem de sucesso.');
//toast.exibir('atencao', 'Atenção!', 'Mensagem de atenção.');
//toast.exibir('', '', 'Mensagem em branco.');

const videoForm = document.getElementById('video-form');
const videoInput = document.getElementById('video-input');
const videoElement = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const timeline = document.getElementById('timeline');
const imageList = document.getElementById('image-list');
let imageIndex = 0;

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
    link.download = `frame_${imageIndex}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const extractButton = document.createElement('button');
extractButton.innerHTML = '<i class="fa-solid fa-camera"></i> Extract Frame';
extractButton.className = 'w3-button w3-theme-d1 w3-block w3-hover-theme';
extractButton.addEventListener('click', function () {
    captureFrame();
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
                url: 'https://www.lumamax.com.br/api/sdkAds/ads?id_usuario=1&site=8&id_bloco=20',
                divClass: '.adMax1'
            },
            {
                url: 'https://www.lumamax.com.br/api/sdkAds/ads?id_usuario=1&site=8&id_bloco=20',
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
    });
});