import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { setDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

function showFormError(message) {
    const errorDiv = document.getElementById('form-error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const loginButton = document.getElementById('login-button');
    const registerButton = document.getElementById('register-button');

    if (loginButton) {
        loginButton.addEventListener('click', () => {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            signInWithEmailAndPassword(auth, email, password)
                .then(() => { window.location.href = 'dashboard.html'; })
                .catch(() => { showFormError("Email ou senha inválidos."); });
        });
    }

    if (registerButton) {
        registerButton.addEventListener('click', async () => {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const privacyPolicy = document.getElementById('privacy-policy').checked;
            const plan = registerButton.dataset.plan;

            if (!name || !email || !password) return showFormError("Por favor, preencha todos os campos obrigatórios.");
            if (password.length < 6) return showFormError("A sua senha deve ter no mínimo 6 caracteres.");
            if (!privacyPolicy) return showFormError("Você deve concordar com a Política de Privacidade.");

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                await setDoc(doc(db, "users", user.uid), {
                    name: name,
                    email: user.email,
                    plan: plan, 
                    wantsMarketingEmails: document.getElementById('email-marketing')?.checked || false,
                    createdAt: serverTimestamp()
                });

                if (plan === 'pro') {
                    // LINK DE PRODUÇÃO ATUALIZADO
                    window.location.href = 'https://buy.stripe.com/aFaeVd2LV7GjgF5bce5ZC01';
                } else {
                    window.location.href = 'dashboard.html';
                }

            } catch (error) {
                if (error.code === 'auth/email-already-in-use') {
                    showFormError("Este endereço de e-mail já está a ser utilizado.");
                } else {
                    showFormError("Ocorreu um erro ao criar a sua conta. Tente novamente.");
                }
            }
        });
    }
});
