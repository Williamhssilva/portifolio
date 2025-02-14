document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const cards = Array.from(track.children);
    const container = document.querySelector('.carousel-track-container');
    
    // Armazena o conteúdo original dos cards
    const originalCards = cards.map(card => ({
        id: card.getAttribute('aria-label'),
        title: card.querySelector('h3').textContent,
        description: card.querySelector('p').textContent,
        image: card.querySelector('img').src,
        link: card.querySelector('a').href,
        ariaLabel: card.getAttribute('aria-label')
    }));

    // Adiciona cards fantasmas para o efeito circular
    function setupInfiniteScroll() {
        // Clone o último card para o início
        const firstClone = cards[cards.length - 1].cloneNode(true);
        firstClone.setAttribute('data-clone', 'start');
        
        // Clone o primeiro card para o final
        const lastClone = cards[0].cloneNode(true);
        lastClone.setAttribute('data-clone', 'end');
        
        // Adiciona os clones
        track.insertBefore(firstClone, cards[0]);
        track.appendChild(lastClone);
        
        return Array.from(track.children);
    }

    const updatedCards = setupInfiniteScroll();
    let currentIndex = 1; // Começa no primeiro card real (após o clone)
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let isDragging = false;

    function getPositionByIndex(index) {
        const cardWidth = cards[0].offsetWidth;
        const margin = parseInt(window.getComputedStyle(cards[0]).marginRight);
        const containerWidth = container.offsetWidth;
        const totalCardWidth = cardWidth + (margin * 2);
        
        // Calcula o offset para centralizar perfeitamente
        const offset = (containerWidth - cardWidth) / 2;
        
        // Ajusta a posição considerando o offset de centralização
        return -(index * totalCardWidth) + offset;
    }

    function updateCardContent(card, index) {
        // Ajusta o índice para os cards clonados
        const realIndex = index === 0 ? originalCards.length - 1 :
                         index === updatedCards.length - 1 ? 0 :
                         index - 1;
                         
        const content = originalCards[realIndex];
        if (!content) return;
        
        const titleElement = card.querySelector('h3');
        const descriptionElement = card.querySelector('p');
        const imageElement = card.querySelector('img');
        const linkElement = card.querySelector('a');
        
        if (titleElement) {
            const translationKey = `${content.id}-title`;
            titleElement.textContent = translations[currentLang][translationKey] || content.title;
        }
        
        if (descriptionElement) {
            const translationKey = `${content.id}-description`;
            descriptionElement.textContent = translations[currentLang][translationKey] || content.description;
        }
        
        if (imageElement) {
            imageElement.src = content.image;
            imageElement.alt = `Screenshot do projeto ${content.title}`;
        }
        
        if (linkElement) {
            linkElement.href = content.link;
            linkElement.setAttribute('aria-label', 
                `${translations[currentLang]['view-github']} - ${content.title}`);
        }
    }

    function updateCarousel(instant = false) {
        currentTranslate = getPositionByIndex(currentIndex);
        track.style.transition = instant ? 'none' : 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        track.style.transform = `translateX(${currentTranslate}px)`;
        
        updatedCards.forEach((card, index) => {
            card.classList.remove('active');
            if (index === currentIndex) {
                card.classList.add('active');
            }
            // Atualiza o conteúdo de cada card, incluindo os clones
            updateCardContent(card, index);
        });
    }

    function checkIndex() {
        track.style.transition = 'none';
        
        if (currentIndex === updatedCards.length - 1) {
            currentIndex = 1;
            updateCarousel(true);
        }
        
        if (currentIndex === 0) {
            currentIndex = updatedCards.length - 2;
            updateCarousel(true);
        }
    }

    // Event Listeners para arrastar
    function startDragging(e) {
        isDragging = true;
        startPos = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        prevTranslate = currentTranslate;
        track.style.cursor = 'grabbing';
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
        track.style.cursor = 'grab';
        
        const movedBy = currentTranslate - prevTranslate;
        
        if (Math.abs(movedBy) > 100) {
            if (movedBy > 0) {
                currentIndex--;
            } else {
                currentIndex++;
            }
        }
        
        updateCarousel();
        checkIndex();
    }

    // Event Listeners
    updatedCards.forEach(card => {
        card.addEventListener('dragstart', e => e.preventDefault());
        card.addEventListener('mousedown', startDragging);
        card.addEventListener('touchstart', startDragging, { passive: false });
    });

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('mouseup', endDragging);
    document.addEventListener('touchend', endDragging);
    document.addEventListener('mouseleave', endDragging);

    track.addEventListener('transitionend', checkIndex);

    // Inicialização
    updateCarousel(true);

    // Atualização em caso de redimensionamento
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateCarousel(true);
        }, 100);
    });

    track.addEventListener('languagechange', () => {
        updatedCards.forEach((card, index) => {
            updateCardContent(card, index);
        });
        updateCarousel(true);
    });
}); 