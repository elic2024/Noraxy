import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// ARQUIVO CORRIGIDO: A dependência desnecessária do Showdown foi removida.

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

    // MARCAR ARTIGO COMO VISTO
    try {
        let viewedArticles = JSON.parse(localStorage.getItem('viewedArticles')) || [];
        if (!viewedArticles.includes(contentId)) {
            viewedArticles.push(contentId);
            localStorage.setItem('viewedArticles', JSON.stringify(viewedArticles));
        }
    } catch (e) {
        console.error("Erro ao marcar artigo como visto:", e);
    }

    try {
        const docRef = doc(db, "contents", contentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const content = docSnap.data();

            contentTitleEl.textContent = content.title;
            
            // SOLUÇÃO FINAL: Insere o seu HTML diretamente na página.
            contentBodyEl.innerHTML = content.description;

            // Ativa o botão de partilha
            shareButton.href = `partilha-view.html?id=${contentId}`;
            shareButton.style.display = 'inline-block';

        } else {
            contentContainer.innerHTML = "<h1>Artigo não encontrado</h1><p>Este conteúdo pode ter sido removido.</p>";
        }
    } catch (error) {
        console.error("Erro ao carregar o conteúdo:", error);
        contentContainer.innerHTML = `<h1>Ocorreu um erro</h1><p>Não foi possível carregar o conteúdo. Tente novamente mais tarde.</p><pre>${error.message}</pre>`;
    }
});
