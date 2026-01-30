import { auth } from './firebase-config.js';
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

function showFormMessage(message, isError = false) {
    const messageDiv = document.getElementById('form-message');
    if (messageDiv) {
        messageDiv.textContent = message;
        // Usa as classes de erro que já criámos, ou uma nova classe de sucesso
        messageDiv.className = isError ? 'form-error-message' : 'form-success-message';
        messageDiv.style.display = 'block';
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const resetButton = document.getElementById('reset-password-button');
    const emailInput = document.getElementById('email');

    if (resetButton) {
        resetButton.addEventListener('click', () => {
            const email = emailInput.value;
            if (!email) {
                return showFormMessage("Por favor, insira o seu endereço de e-mail.", true);
            }

            sendPasswordResetEmail(auth, email)
                .then(() => {
                    showFormMessage("Sucesso! Se este e-mail estiver registado, receberá um link para redefinir a sua senha em breve.");
                    emailInput.value = ''; // Limpa o campo
                })
                .catch((error) => {
                    // Por segurança, mostramos a mesma mensagem de sucesso mesmo que o email não exista
                    // para não se poder adivinhar quais emails estão registados.
                    showFormMessage("Sucesso! Se este e-mail estiver registado, receberá um link para redefinir a sua senha em breve.");
                    console.error("Erro no processo de recuperação (isto é normal se o email não existir):", error.code);
                });
        });
    }
});
