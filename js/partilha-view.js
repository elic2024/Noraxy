import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// VERSÃO SEGURA: Este script NÃO tem acesso ao conteúdo do artigo.

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const contentId = urlParams.get('id');

    const shareContentCard = document.getElementById('share-content-card');

    if (!contentId) {
        shareContentCard.innerHTML = "<p>Artigo não encontrado.</p>";
        return;
    }

    try {
        const docRef = doc(db, "contents", contentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const content = docSnap.data();

            // Este é o link que a pessoa partilhada irá clicar
            const viewLink = `view-content.html?id=${contentId}`;

            let cardHTML = `
                <img src="${content.coverImageUrl}" alt="${content.title}" class="share-card-image">
                <div class="share-card-body">
                    <h3>${content.title}</h3>
                    <p>Um artigo exclusivo da comunidade NORAXY.</p>
                    <a href="${viewLink}" class="btn btn-primary">
                        Ler Artigo na NORAXY
                    </a>
                </div>
            `;
            shareContentCard.innerHTML = cardHTML;

        } else {
            shareContentCard.innerHTML = "<p>Artigo não encontrado.</p>";
        }
    } catch (error) {
        console.error("Erro ao carregar o artigo:", error);
        shareContentCard.innerHTML = "<p>Ocorreu um erro ao carregar o artigo.</p>";
    }
});
