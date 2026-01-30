import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const messageElement = document.getElementById("message");

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // Usuário está logado. Agora, podemos atualizar o seu plano.
            messageElement.textContent = "A finalizar a sua subscrição Pro...";
            const userDocRef = doc(db, "users", user.uid);

            try {
                // ATUALIZAÇÃO SEGURA: Só atualiza o plano para 'pro' nesta página
                await updateDoc(userDocRef, { plan: "pro" });

                messageElement.textContent = "Sucesso! A sua conta foi atualizada para Pro. A redirecionar para o dashboard em 3 segundos...";

                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 3000);

            } catch (error) {
                console.error("Erro ao atualizar o plano do usuário:", error);
                messageElement.textContent = "Ocorreu um erro ao finalizar a sua subscrição. Por favor, contacte o suporte.";
            }
        } else {
            // Se o usuário não estiver logado, não podemos fazer nada.
            messageElement.textContent = "Pagamento concluído. Por favor, faça login para aceder aos seus conteúdos Pro.";
        }
    });
});
