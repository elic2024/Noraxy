import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { collection, query, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { displayContentPreview } from './content.js';

function setupBannerCarousel() {
    const images = document.querySelectorAll('.banner-image');
    if (images.length === 0) return;
    let currentIndex = 0;

    setInterval(() => {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
    }, 3000); // Troca a cada 3 segundos
}

async function loadHomepageContent() {
    try {
        const q = query(collection(db, "contents"));
        const querySnapshot = await getDocs(q);
        displayContentPreview(querySnapshot.docs.slice(0, 4));
    } catch (error) {
        console.error("Erro ao carregar conteúdos da página inicial:", error);
        const previewGrid = document.getElementById("content-preview-grid");
        if (previewGrid) previewGrid.innerHTML = "<p style='color:red'>Não foi possível carregar os conteúdos.</p>";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setupBannerCarousel(); // Inicia o carrossel
    loadHomepageContent();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            window.location.replace('dashboard.html');
        }
    });
});
