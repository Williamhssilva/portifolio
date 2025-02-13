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
    let cardWidth = cards[0].getBoundingClientRect().width;

    const setCardPosition = (card, index) => {
        card.style.left = cardWidth * index + 'px';
    };
    cards.forEach(setCardPosition);

    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    let currentIndex = 0;

    cards.forEach((card, index) => {
        const cardImage = card.querySelector('img');
        cardImage.addEventListener('dragstart', (e) => e.preventDefault());

        card.addEventListener('touchstart', touchStart(index));
        card.addEventListener('touchend', touchEnd);
        card.addEventListener('touchmove', touchMove);

        card.addEventListener('mousedown', touchStart(index));
        card.addEventListener('mouseup', touchEnd);
        card.addEventListener('mouseleave', touchEnd);
        card.addEventListener('mousemove', touchMove);
    });

    function touchStart(index) {
        return function(event) {
            currentIndex = index;
            startPos = getPositionX(event);
            isDragging = true;
            animationID = requestAnimationFrame(animation);
            track.style.cursor = 'grabbing';
        }
    }

    function touchEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);

        const movedBy = currentTranslate - prevTranslate;

        if (movedBy < -100) {
            if (currentIndex < cards.length - 1) {
                currentIndex += 1;
            } else {
                currentIndex = 0; // Reinicia no primeiro card
            }
        }

        if (movedBy > 100) {
            if (currentIndex > 0) {
                currentIndex -= 1;
            } else {
                currentIndex = cards.length - 1; // Vai para o último card
            }
        }

        setPositionByIndex();

        track.style.cursor = 'grab';
    }

    function touchMove(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            currentTranslate = prevTranslate + currentPosition - startPos;
        }
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function animation() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animation);
    }

    function setSliderPosition() {
        track.style.transform = `translateX(${currentTranslate}px)`;
    }

    function setPositionByIndex() {
        currentTranslate = currentIndex * -cardWidth;
        prevTranslate = currentTranslate;
        setSliderPosition();
    }

    window.addEventListener('resize', () => {
        cardWidth = cards[0].getBoundingClientRect().width;
        cards.forEach(setCardPosition);
        setPositionByIndex();
    });

    cards[0].classList.add('current-card');
}); 