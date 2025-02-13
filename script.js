function setLanguage(language) {
    console.log(`Changing language to: ${language}`);
    
    const header = document.querySelector('h1');
    const aboutHeader = document.querySelector('#about h2');
    const contactHeader = document.querySelector('#contact h2');
    const navLinks = document.querySelectorAll('nav ul li a');

    console.log('Header:', header);
    console.log('About Header:', aboutHeader);
    console.log('Contact Header:', contactHeader);
    console.log('Nav Links:', navLinks);

    if (header) header.textContent = translate(language, 'welcome');
    if (aboutHeader) aboutHeader.textContent = translate(language, 'about');
    if (contactHeader) contactHeader.textContent = translate(language, 'contact');

    navLinks.forEach((link, index) => {
        if (index === 0) link.textContent = translate(language, 'about');
        if (index === 1) link.textContent = translate(language, 'projects');
        if (index === 2) link.textContent = translate(language, 'contact');
    });

    // Atualizar textos dos projetos
    document.querySelectorAll('.carousel-card').forEach((card, index) => {
        console.log(`Updating card ${index + 1}`);
        const cardTitle = card.querySelector('h3');
        const cardDescription = card.querySelector('p');
        const cardLink = card.querySelector('a');

        if (cardTitle) cardTitle.textContent = translate(language, `project${index + 1}`);
        if (cardDescription) cardDescription.textContent = translate(language, `project${index + 1}Description`);
        if (cardLink) cardLink.textContent = translate(language, 'viewOnGitHub');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const cards = Array.from(track.children);
    const container = document.querySelector('.carousel-track-container');
    
    let currentIndex = 1; // Começamos do índice 1 (primeiro card real)
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let isDragging = false;

    function getPositionByIndex(index) {
        const cardWidth = cards[0].offsetWidth;
        const containerWidth = container.offsetWidth;
        const margin = parseInt(window.getComputedStyle(cards[0]).marginRight);
        const offset = (containerWidth - cardWidth) / 2;
        return -(index * (cardWidth + margin * 2)) + offset;
    }

    function updateCarousel(instant = false) {
        currentTranslate = getPositionByIndex(currentIndex);
        
        track.style.transition = instant ? 'none' : 'transform 0.3s ease-in-out';
        track.style.transform = `translateX(${currentTranslate}px)`;
        
        cards.forEach((card, index) => {
            card.classList.remove('active');
            if (index === currentIndex) {
                card.classList.add('active');
            }
        });
    }

    // Função para verificar e ajustar o loop infinito
    function checkIndex() {
        track.style.transition = 'none';
        if (currentIndex === cards.length - 1) {
            currentIndex = 1;
            updateCarousel(true);
        }
        if (currentIndex === 0) {
            currentIndex = cards.length - 2;
            updateCarousel(true);
        }
    }

    track.addEventListener('transitionend', checkIndex);

    cards.forEach((card, index) => {
        card.addEventListener('mousedown', startDragging, { passive: false });
        card.addEventListener('touchstart', startDragging, { passive: false });
        card.addEventListener('dragstart', (e) => e.preventDefault());
    });

    document.addEventListener('mousemove', drag, { passive: false });
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('mouseup', endDragging);
    document.addEventListener('touchend', endDragging);

    function startDragging(e) {
        isDragging = true;
        startPos = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        prevTranslate = currentTranslate;
        track.style.transition = 'none';
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const currentPosition = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        const diff = currentPosition - startPos;
        currentTranslate = prevTranslate + diff;
        track.style.transform = `translateX(${currentTranslate}px)`;
    }

    function endDragging() {
        if (!isDragging) return;
        isDragging = false;
        const movedBy = currentTranslate - prevTranslate;
        
        track.style.transition = 'transform 0.3s ease-in-out';
        
        if (Math.abs(movedBy) > 100) {
            if (movedBy > 0) {
                currentIndex--;
            } else {
                currentIndex++;
            }
        }
        
        updateCarousel();
    }

    // Inicialização
    updateCarousel(true);

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateCarousel(true);
        }, 100);
    });
}); 