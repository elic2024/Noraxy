import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
    const contentTitleEl = document.getElementById('content-title');
    const contentBodyEl = document.getElementById('content-body');

    try {
        if (typeof showdown === 'undefined') {
            throw new Error("A biblioteca de conversão (Showdown) não pôde ser carregada.");
        }

        const params = new URLSearchParams(window.location.search);
        const contentId = params.get('id');

        if (!contentId) {
            throw new Error("Nenhum conteúdo foi especificado no URL.");
        }

        const contentRef = doc(db, "contents", contentId);
        const contentSnap = await getDoc(contentRef);

        if (contentSnap.exists()) {
            const content = contentSnap.data();
            contentTitleEl.textContent = content.title;

            // --- LÓGICA INTELIGENTE PARA SELECIONAR O TIPO DE MÍDIA ---
            switch (content.mediaType) {
                case 'video':
                    // Se for um vídeo, cria um leitor de vídeo incorporado
                    contentBodyEl.innerHTML = `
                        <div class="video-container">
                            <iframe 
                                src="https://www.youtube.com/embed/${content.mediaUrl}" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen>
                            </iframe>
                        </div>
                        <div class="video-description"></div>
                    `;
                    // Também processa a descrição em Markdown abaixo do vídeo
                    const converter = new showdown.Converter();
                    const htmlDescription = converter.makeHtml(content.description || "");
                    contentBodyEl.querySelector('.video-description').innerHTML = htmlDescription;
                    break;

                // Futuramente, podemos adicionar: case 'pdf': ...

                default:
                    // Se for texto (ou não especificado), processa a descrição com Markdown
                    const textConverter = new showdown.Converter();
                    const htmlContent = textConverter.makeHtml(content.description || "Este conteúdo ainda não tem descrição.");
                    contentBodyEl.innerHTML = htmlContent;
                    break;
            }

        } else {
            throw new Error("O conteúdo que você está a procurar não existe ou foi removido.");
        }
    } catch (error) {
        console.error("ERRO AO CARREGAR CONTEÚDO:", error);
        contentTitleEl.textContent = "Erro ao Carregar";
        contentBodyEl.innerHTML = `<p style="color: red; font-weight: bold;">Ocorreu um erro: ${error.message}</p>`;
    }
});
