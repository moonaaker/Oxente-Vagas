const loadingScreen = document.querySelector(".Carregamento");

// Tempo total da animação
setTimeout(() => {
    if (loadingScreen) {
        loadingScreen.style.display = "none";
    }

    document.body.style.overflow = "auto";

}, 4600);