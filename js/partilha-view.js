import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const contentId = urlParams.get('id');

    const shareContentCard = document.getElementById('share-content-card');
    const shareLinkInput = document.getElementById('share-link-input');
    const copyLinkButton = document.getElementById('copy-link-button');

    if (!contentId) {
        shareContentCard.innerHTML = "<p>Artigo não encontrado.</p>";
        return;
    }

    const contentUrl = `https://noraxy.netlify.app/view-content.html?id=${contentId}`;
    shareLinkInput.value = contentUrl;

    copyLinkButton.addEventListener('click', () => {
        shareLinkInput.select();
        document.execCommand('copy');
        copyLinkButton.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => { copyLinkButton.innerHTML = '<i class="fas fa-copy"></i>'; }, 2000);
    });

    try {
        const docRef = doc(db, "contents", contentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const content = docSnap.data();
            const isPro = content.type === 'pro';

            // CÓDIGO CORRIGIDO USANDO OS NOMES DE CAMPO REAIS
            let cardHTML = `
                <img src="${content.coverImageUrl}" alt="${content.title}" class="share-card-image">
                <div class="share-card-body">
                    <h3>${content.title}</h3>
                    <p>Um artigo da comunidade NORAXY.</p>
                    <a href="${isPro ? 'register-pro.html' : 'register-plus.html'}" class="btn ${isPro ? 'btn-primary' : 'btn-secondary'}">
                        Subscrever para Ler
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
