import { auth, db } from './firebase-config.js';
import { doc, updateDoc, query, onSnapshot, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

async function upgradePlan(user) {
    if (!user) return alert("Você precisa estar logado para subscrever.");
    // Redireciona para o link de pagamento de produção
    window.location.href = 'https://buy.stripe.com/aFaeVd2LV7GjgF5bce5ZC01';
}

async function sendGift(contentId, giftType) {
    const user = auth.currentUser;
    if (!user) {
        alert("Você precisa estar logado para enviar um presente.");
        return window.location.href = 'login.html';
    }

    const giftLinks = {
        // LINKS DE PRODUÇÃO ATUALIZADOS
        'flor': 'https://buy.stripe.com/4gM8wP5Y7d0D4Wncgi5ZC02',
        'diamante': 'https://buy.stripe.com/bJe6oH0DNgcP3Sjcgi5ZC03',
        'coracao': 'https://buy.stripe.com/fZu28raen0dR1Kb1BE5ZC04'
    };

    const paymentLink = giftLinks[giftType];

    if (paymentLink) {
        const checkoutUrl = `${paymentLink}?prefilled_email=${encodeURIComponent(user.email)}`;
        window.location.href = checkoutUrl;
    } else {
        alert("Ocorreu um erro ao processar o seu presente.");
        console.error("Tipo de presente inválido:", giftType);
    }
}


function renderContentCards(element, contentsDocs, userPlan) {
    element.innerHTML = '';
    for (const doc of contentsDocs) {
        const content = doc.data();
        const contentId = doc.id;

        const card = document.createElement('div');
        card.className = 'content-card';

        const isProContent = content.type === "pro";

        if (isProContent) {
            card.classList.add('content-card-pro');
        }

        const imageUrl = content.coverImageUrl || 'https://via.placeholder.com/400x200.png?text=NORAX';
        const linkArea = document.createElement('a');
        linkArea.className = 'card-link-area';
        linkArea.innerHTML = `<img src="${imageUrl}" alt="${content.title}" class="card-cover-image"><div class="card-body"><h3>${content.title}</h3></div>`;
        card.appendChild(linkArea);

        const interactionsContainer = document.createElement('div');
        interactionsContainer.className = 'card-interactions';
        card.appendChild(interactionsContainer);

        const isLoggedIn = userPlan !== null;
        
        if (isLoggedIn) {
            const canAccess = !isProContent || (isProContent && userPlan === "pro");
            if (canAccess) {
                linkArea.href = `view-content.html?id=${contentId}`;
                
                const paidGifts = { 'Flor': 'flor', 'Coração': 'coracao', 'Diamante': 'diamante' };
                const giftIcons = { 'Flor': '🌸', 'Coração': '❤️', 'Diamante': '💎' };

                for (const giftName in paidGifts) {
                    const giftButton = document.createElement('button');
                    giftButton.className = 'gift-button';
                    giftButton.innerHTML = `${giftIcons[giftName]} ${giftName}`;
                    giftButton.addEventListener('click', () => sendGift(contentId, paidGifts[giftName]));
                    interactionsContainer.appendChild(giftButton);
                }
            } else {
                linkArea.href = '#';
                linkArea.style.cursor = 'default';
                const upgradeButton = document.createElement('button');
                upgradeButton.className = 'subscribe-button-visual';
                upgradeButton.textContent = "Subscrever Pro para Aceder";
                upgradeButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    upgradePlan(auth.currentUser);
                });
                interactionsContainer.appendChild(upgradeButton);
            }
        } else {
            linkArea.href = isProContent ? 'register-pro.html' : 'register-plus.html';
            const ctaButton = document.createElement('span');
            ctaButton.className = 'subscribe-button-visual';
            ctaButton.textContent = "Subscrever para Ver";
            interactionsContainer.appendChild(ctaButton);
        }
        element.appendChild(card);
    }
}

export function displayContentPreview(contentsDocs) {
    const previewGrid = document.getElementById("content-preview-grid");
    if (previewGrid) {
        renderContentCards(previewGrid, contentsDocs, null);
    }
}

export function displayContents(contentsDocs, userPlan) {
    const contentSection = document.getElementById("content-section");
    if (contentSection) {
        renderContentCards(contentSection, contentsDocs, userPlan);
    }
}
