import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, getDoc, onSnapshot, collection, query, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { displayContents } from './content.js';

document.addEventListener("DOMContentLoaded", () => {
    const loggedInView = document.getElementById('logged-in-view');
    const unauthorizedView = document.getElementById('unauthorized-view');
    const userNameEl = document.getElementById('name');
    const logoutButton = document.getElementById('logout-button');
    const contentSection = document.getElementById('content-section');

    let unsubscribeUserPlan = null;

    onAuthStateChanged(auth, (user) => {
        if (user) {
            loggedInView.style.display = 'block';
            unauthorizedView.style.display = 'none';

            if (unsubscribeUserPlan) unsubscribeUserPlan();

            const userDocRef = doc(db, "users", user.uid);

            // Este é o ÚNICO listener. Ele vigia o plano do usuário.
            unsubscribeUserPlan = onSnapshot(userDocRef, async (userDoc) => {
                try {
                    let userPlan = 'plus';
                    let userName = user.email; 

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        userPlan = userData.plan;
                        userName = userData.name || user.email;
                    }

                    sessionStorage.setItem('userPlan', userPlan);
                    userNameEl.textContent = userName;

                    // --- O FLUXO SIMPLES E CORRETO ---
                    const contentsQuery = query(collection(db, "contents"));
                    const contentsSnapshot = await getDocs(contentsQuery);
                    displayContents(contentsSnapshot.docs, userPlan);

                } catch (error) {
                    console.error("ERRO FATAL AO CARREGAR CONTEÚDOS:", error);
                    contentSection.innerHTML = `<p style='color:red;'>Erro fatal: Não foi possível carregar os conteúdos.</p>`;
                }
            }, (error) => {
                console.error("Erro fatal ao ler os dados do usuário:", error);
                contentSection.innerHTML = `<p style='color:red;'>Erro fatal: Não foi possível ler os dados do seu plano.</p>`;
            });

        } else {
            loggedInView.style.display = 'none';
            unauthorizedView.style.display = 'block';
            if (unsubscribeUserPlan) unsubscribeUserPlan();
        }
    });

    logoutButton.addEventListener('click', () => {
        signOut(auth).then(() => {
            sessionStorage.removeItem('userPlan');
            window.location.href = 'index.html';
        });
    });
});
