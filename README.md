[![Check Render App Availability](https://github.com/valdir-alves3000/vsaldios/workflows/Check%20Render%20App%20Availability/badge.svg)](https://github.com/valdir-alves3000/vsaldios/actions)

# VSaldios

![preview](./.github/banner.png)

É uma aplicação web desenvolvida para facilitar o processo de baixar e visualizar vídeos diretamente do YouTube. Com o VSaldios, os usuários podem acessar uma interface amigável que lhes permite inserir URLs de vídeos do YouTube e obter acesso rápido e conveniente aos vídeos desejados.

## Funcionalidades

- **Obtenção de Informações de Vídeo**: Insira a URL do vídeo do YouTube e obtenha informações sobre o vídeo, incluindo descrição, formatos disponíveis e URL do iframe para incorporação.

- **Pré-visualização do Vídeo**: O aplicativo exibe uma pré-visualização do vídeo, incluindo a descrição, o iframe do vídeo e os formatos disponíveis para download.

- **Download de Vídeo e Áudio**: Os usuários podem baixar os vídeos e áudios disponíveis em diferentes formatos e qualidades.

- **Visualização de Detalhes**: O aplicativo exibe detalhes sobre os vídeos, como descrição, formatos de vídeo e áudio disponíveis.

## Tecnologias Utilizadas

O VSaldios foi construído usando as seguintes tecnologias:

- **Frontend**: HTML, CSS, JavaScript (ES6)
- **Backend**: Node.js, Express.js
- **Bibliotecas**: `ytdl-core` para interagir com vídeos do YouTube

## Pré-requisitos

- Node.js e npm instalados localmente.

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/valdir-alves3000/vsaldios.git
   ```

2. Instale as dependências:

   ```bash
   cd vsaldios
   npm install
   ```

3. Execute o aplicativo:

   ```bash
   npm start
   ```

4. Acesse o servidor em `http://localhost:3333`.

## Tecnologias Utilizadas

- Node.js
- Express.js
- yt-dlp-exec
- HTML
- CSS

Vamos ver como ficou o projeto? Acesse e Confira → [VSaldios](https://vsaldios.onrender.com/)

### Observações

- Certifique-se de que o servidor backend esteja em execução antes de acessar o frontend, pois ele depende das APIs fornecidas pelo servidor para funcionar corretamente.
- O BrowserSync irá monitorar os arquivos no diretório do frontend e recarregar automaticamente o navegador quando houver alterações nos arquivos.
