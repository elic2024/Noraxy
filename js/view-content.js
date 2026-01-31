import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
    const contentTitleEl = document.getElementById('content-title');
    const contentBodyEl = document.getElementById('content-body');
    const contentContainer = document.getElementById('content-container');
    const shareButton = document.getElementById('share-button'); 

    const urlParams = new URLSearchParams(window.location.search);
    const contentId = urlParams.get('id');

    if (!contentId) {
        contentContainer.innerHTML = "<h1>Artigo não encontrado</h1><p>O link que você seguiu parece estar quebrado.</p>";
        return;
    }

    try {
        const docRef = doc(db, "contents", contentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const content = docSnap.data();

            contentTitleEl.textContent = content.title;
            contentBodyEl.innerHTML = content.description;

            // --- NOVA LÓGICA DE PARTILHA ---
            shareButton.style.display = 'inline-block'; // Torna o botão visível

            shareButton.addEventListener('click', async (e) => {
                e.preventDefault(); // Impede a navegação para o href="#"

                const shareData = {
                    title: content.title,
                    text: `Um artigo imperdível da NORAXY: "${content.title}"`,
                    url: `https://noraxy.netlify.app/partilha-view.html?id=${contentId}`
                };

                try {
                    // Tenta usar a API de partilha nativa
                    if (navigator.share) {
                        await navigator.share(shareData);
                    } else {
                        // Se não for suportada, copia para a área de transferência
                        navigator.clipboard.writeText(shareData.url);
                        alert("Link do artigo copiado para a sua área de transferência!");
                    }
                } catch (err) {
                    console.error("Erro ao partilhar:", err);
                }
            });

        } else {
            contentContainer.innerHTML = "<h1>Artigo não encontrado</h1><p>Este conteúdo pode ter sido removido.</p>";
        }
    } catch (error) {
        console.error("Erro ao carregar o conteúdo:", error);
        contentContainer.innerHTML = `<h1>Ocorreu um erro</h1><p>Não foi possível carregar o conteúdo. Tente novamente mais tarde.</p><pre>${error.message}</pre>`;
    }
});
