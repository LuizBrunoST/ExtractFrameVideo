//toast.exibir('erro', 'Erro!', 'Mensagem de erro.');
//toast.exibir('sucesso', 'Sucesso!', 'Mensagem de sucesso.');
//toast.exibir('atencao', 'Atenção!', 'Mensagem de atenção.');
//toast.exibir('', '', 'Mensagem em branco.');

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
        },
        {
            url: 'https://lumamax.com.br/api/sdkAds/ads?id_usuario=1&site=8&id_bloco=20',
            divClass: '.adMax1'
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

document.getElementById('videoInput').addEventListener('change', handleFileSelect, false);

function handleFileSelect(event) {
    const files = event.target.files;
    const videoList = document.getElementById('videoList');
    videoList.innerHTML = '';

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Cria um contêiner para o vídeo e controles
        const videoContainer = document.createElement('div');
        videoContainer.classList.add('container-flex','w3-mobile');

        // Cria um elemento de vídeo
        const video = document.createElement('video');
        video.controls = false;
        video.muted;
        video.src = URL.createObjectURL(file);
        video.width = 300;
        video.dataset.index = i;

        // Cria elementos para definir o tempo de loop
        const loopForm = document.createElement('form');
        loopForm.innerHTML = `
            <label>Início do Loop (s):
                <input type="number" step="0.1" min="0" class="start-time w3-input" value="0">
            </label>
            <label>Fim do Loop (s):
                <input type="number" step="0.1" min="0" class="end-time w3-input" value="0">
            </label>
            <button class="w3-button w3-block" type="button">Aplicar Loop</button>
        `;

        // Adiciona evento ao botão para aplicar o loop
        loopForm.querySelector('button').addEventListener('click', () => {
            const startTime = parseFloat(loopForm.querySelector('.start-time').value);
            const endTime = parseFloat(loopForm.querySelector('.end-time').value);
            applyLoop(video, startTime, endTime);
        });

        // Adiciona o vídeo e os controles ao contêiner
        videoContainer.appendChild(video);
        videoContainer.appendChild(loopForm);

        // Adiciona o contêiner à lista de vídeos
        videoList.appendChild(videoContainer);

        // Adiciona uma div com anúncio a cada três vídeos
        if ((i + 1) % 3 === 0) {
            const adContainer = document.createElement('div');
            adContainer.classList.add('ad-container','adMax2');
            adContainer.style.width = '300px';
            adContainer.innerHTML = '<div class="adMax2 w3-margin-top w3-margin-bottom" id="adMax2">Anúncio</div>';
            videoList.appendChild(adContainer);
            loadAds();
        }
    }
}

function applyLoop(video, startTime, endTime) {
    video.loop = true;
    video.addEventListener('timeupdate', () => {
        if (video.currentTime >= endTime) {
            video.currentTime = startTime;
            video.play();
        }
    });
}