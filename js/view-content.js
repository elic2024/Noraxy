import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// VERSÃO FINAL E SEGURA

document.addEventListener("DOMContentLoaded", () => {
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

    onAuthStateChanged(auth, async (user) => {
        try {
            const contentDocRef = doc(db, "contents", contentId);
            const contentSnap = await getDoc(contentDocRef);

            if (!contentSnap.exists()) {
                contentContainer.innerHTML = "<h1>Artigo não encontrado</h1><p>Este conteúdo pode ter sido removido.</p>";
                return;
            }

            const contentData = contentSnap.data();
            const isProContent = contentData.type === 'pro';

            let userPlan = null;
            if (user) {
                const userDocRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userDocRef);
                if (userSnap.exists()) {
                    userPlan = userSnap.data().plan;
                }
            }

            const canAccess = !isProContent || (isProContent && userPlan === 'pro');

            if (canAccess) {
                // O usuário tem permissão. Mostra o conteúdo.
                contentTitleEl.textContent = contentData.title;
                contentBodyEl.innerHTML = contentData.description;

                // Marca como visto
                let viewedArticles = JSON.parse(localStorage.getItem('viewedArticles')) || [];
                if (!viewedArticles.includes(contentId)) {
                    viewedArticles.push(contentId);
                    localStorage.setItem('viewedArticles', JSON.stringify(viewedArticles));
                }

                // Ativa o botão de partilha
                shareButton.style.display = 'inline-block';
                shareButton.addEventListener('click', async (e) => {
                    e.preventDefault();
                    const shareData = { title: contentData.title, text: `Um artigo da NORAXY: "${contentData.title}"`, url: `https://noraxy.netlify.app/partilha-view.html?id=${contentId}` };
                    try {
                        if (navigator.share) await navigator.share(shareData);
                        else { navigator.clipboard.writeText(shareData.url); alert("Link de partilha copiado!"); }
                    } catch (err) { console.error("Erro ao partilhar:", err); }
                });

            } else {
                // O usuário NÃO tem permissão. Mostra a barreira de acesso.
                contentTitleEl.textContent = "Acesso Exclusivo";
                let accessDeniedHTML = `
                    <div style="text-align: center;">
                        <img src="${contentData.coverImageUrl}" alt="${contentData.title}" style="max-width: 100%; border-radius: 8px; margin-bottom: 20px;">
                        <h3>${contentData.title}</h3>
                        <p>Este é um conteúdo exclusivo para membros do plano Pro.</p>
                        <a href="register-pro.html" class="btn btn-primary">Subscrever Pro para Ler</a>
                        <p style="margin-top: 15px;">Já é membro Pro? <a href="login.html">Faça o login</a></p>
                    </div>
                `;
                contentBodyEl.innerHTML = accessDeniedHTML;
                shareButton.style.display = 'none';
            }
        } catch (error) {
            console.error("Erro ao carregar o conteúdo:", error);
            contentContainer.innerHTML = `<h1>Ocorreu um erro</h1><p>Não foi possível verificar a sua permissão. Tente novamente.</p>`;
        }
    });
});
