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

    // Adicione isso após a inicialização do carousel
    function setupImageModal() {
        const modal = document.getElementById('imageModal');
        if (!modal) {
            console.warn('Modal não encontrado no DOM');
            return;
        }

        const modalImg = document.getElementById('modalImage');
        const closeBtn = modal.querySelector('.close-modal');
        const prevBtn = modal.querySelector('.modal-prev');
        const nextBtn = modal.querySelector('.modal-next');
        let currentImageIndex = 0;

        // Mudança aqui: usando a classe correta
        const projectImages = document.querySelectorAll('.carousel-card img');
        
        // Debug para verificar se encontrou as imagens
        console.log('Imagens encontradas:', projectImages.length);

        projectImages.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                console.log('Imagem clicada:', index);
                currentImageIndex = index;
                openModal(img.src);
            });
        });

        function openModal(imgSrc) {
            console.log('Abrindo modal com imagem:', imgSrc);
            modal.classList.add('show');
            modalImg.src = imgSrc;
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }

        function showNextImage() {
            currentImageIndex = (currentImageIndex + 1) % projectImages.length;
            modalImg.src = projectImages[currentImageIndex].src;
        }

        function showPrevImage() {
            currentImageIndex = (currentImageIndex - 1 + projectImages.length) % projectImages.length;
            modalImg.src = projectImages[currentImageIndex].src;
        }

        // Event Listeners
        closeBtn.addEventListener('click', closeModal);
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
        
        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        });

        // Fechar clicando fora da imagem
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Chama a função quando o DOM estiver pronto
    setupImageModal();

    // Função para atualizar textos da seção About
    function updateAboutContent() {
        const aboutContent = document.querySelector('.about-content');
        if (aboutContent) {
            aboutContent.innerHTML = `
                <p>${translations[currentLang]['about-p1']}</p>
                <p>${translations[currentLang]['about-p2']}</p>
                <p>${translations[currentLang]['about-p3']}</p>
            `;
        }
    }

    function setLanguage(lang) {
        currentLang = lang;
        
        // Atualiza textos do header
        updateText('h1', 'welcome');
        document.querySelectorAll('nav a').forEach(link => {
            const key = link.getAttribute('href').replace('#', '');
            link.textContent = translations[currentLang][key];
        });

        // Atualiza seção Sobre
        updateText('#about h2', 'about-title');
        updateAboutContent();

        // Atualiza seção Projetos
        updateText('#projects h2', 'projects-title');
        document.querySelectorAll('.carousel-card a').forEach(link => {
            link.textContent = translations[currentLang]['view-github'];
        });

        // Atualiza seção Contato
        updateText('#contact h2', 'contact-title');
        updateText('label[for="name"]', 'name-label');
        updateText('label[for="email"]', 'email-label');
        updateText('label[for="message"]', 'message-label');
        updateText('.submit-btn', 'send-button');

        // Atualiza seção de Idiomas
        updateText('#languages h2', 'languages-title');
        document.querySelectorAll('.language-card').forEach(card => {
            const languageNameElement = card.querySelector('.language-name');
            const languageLevelElement = card.querySelector('.language-level');
            
            if (languageNameElement) {
                const langKey = languageNameElement.getAttribute('data-lang');
                if (langKey) {
                    languageNameElement.textContent = translations[currentLang][langKey];
                }
            }
            
            if (languageLevelElement) {
                const levelKey = languageLevelElement.getAttribute('data-level');
                if (levelKey) {
                    languageLevelElement.textContent = translations[currentLang][levelKey];
                }
            }
        });

        // Atualiza footer
        updateText('footer p', 'footer-text');
    }

    function updateText(selector, key) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = translations[currentLang][key];
        }
    }

    const backToTopButton = document.getElementById('backToTop');

    // Mostrar/ocultar botão baseado na posição do scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    // Ação de voltar ao topo
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}); 