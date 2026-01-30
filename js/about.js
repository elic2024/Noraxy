function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener("submit", async function(e) {
        e.preventDefault();
        const status = document.getElementById('contact-form-status');
        const data = new FormData(e.target);
        try {
            const response = await fetch(e.target.action, { method: form.method, body: data, headers: { 'Accept': 'application/json' } });
            if (response.ok) {
                status.innerHTML = "Obrigado pela sua mensagem!";
                form.reset();
            } else {
                status.innerHTML = "Oops! Ocorreu um problema ao enviar o seu formulário.";
            }
        } catch (error) {
            status.innerHTML = "Oops! Ocorreu um problema ao enviar o seu formulário.";
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupContactForm();
});
