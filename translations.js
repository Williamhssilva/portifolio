const translations = {
    'pt-br': {
        // Header
        'welcome': 'Bem-vindo ao Meu Portfólio',
        'about': 'Sobre Mim',
        'projects': 'Projetos',
        'contact': 'Contato',

        // About Section
        'about-title': 'Sobre Mim',
        'about-p1': 'Cientista da Computação formado pela Universidade de Franca (UNIFRAN), com uma sólida experiência em desenvolvimento Full Stack e uma paixão por educação em tecnologia.',
        'about-p2': 'Minha jornada profissional inclui experiências significativas como Professor na Euro Anglo Cursos, onde ministrei aulas de Informática, Desenvolvimento Web e Manutenção de Computadores. Também atuei como Desenvolvedor Full Stack na Immobile Business, desenvolvendo sistemas web para o setor imobiliário, e como Game Designer na CISU-Franca, onde trabalhei com desenvolvimento de jogos educativos utilizando Unity e C#.',

        // Projects Section
        'projects-title': 'Projetos',
        'view-github': 'Ver no GitHub',
        
        // Projetos específicos
        'lolversus-title': 'LOLVersus',
        'lolversus-description': 'LOLVersus é uma aplicação web interativa que ajuda jogadores de League of Legends a encontrar os melhores counters para qualquer campeão.',
        
        'quizquest-title': 'QuizQuest',
        'quizquest-description': 'Uma aplicação web que utiliza o modelo Mistral-7B localmente através do GPT4All para processar perguntas e respostas.',
        
        'autovideo-title': 'AutoVideo',
        'autovideo-description': 'AutoVideo é uma aplicação web que automatiza o processo de adição de legendas em vídeos.',
        
        'gamezero-title': 'GameZero',
        'gamezero-description': 'GameZero é uma aplicação web desenvolvida em React que permite aos usuários fazerem a gestão dos seus jogos terminados.',
        
        'parcero-title': 'Parcero Imóveis',
        'parcero-description': 'API RESTful para o gerenciamento de propriedades imobiliárias.',

        // Contact Section
        'contact-title': 'Contato',
        'name-label': 'Seu Nome',
        'email-label': 'Seu Email',
        'message-label': 'Sua Mensagem',
        'send-button': 'Enviar Mensagem',

        // Footer
        'footer-text': '© 2024 William Silva'
    },
    'en-us': {
        // Header
        'welcome': 'Welcome to My Portfolio',
        'about': 'About Me',
        'projects': 'Projects',
        'contact': 'Contact',

        // About Section
        'about-title': 'About Me',
        'about-p1': 'Computer Science graduate from the University of Franca (UNIFRAN), with solid experience in Full Stack development and a passion for technology education.',
        'about-p2': 'My professional journey includes significant experiences as a Teacher at Euro Anglo Courses, where I taught Computer Science, Web Development, and Computer Maintenance. I also worked as a Full Stack Developer at Immobile Business, developing web systems for the real estate sector, and as a Game Designer at CISU-Franca, where I worked with educational game development using Unity and C#.',

        // Projects Section
        'projects-title': 'Projects',
        'view-github': 'View on GitHub',
        
        // Specific projects
        'lolversus-title': 'LOLVersus',
        'lolversus-description': 'LOLVersus is an interactive web application that helps League of Legends players find the best counters for any champion.',
        
        'quizquest-title': 'QuizQuest',
        'quizquest-description': 'A web application that uses the Mistral-7B model locally through GPT4All to process questions and answers.',
        
        'autovideo-title': 'AutoVideo',
        'autovideo-description': 'AutoVideo is a web application that automates the process of adding subtitles to videos.',
        
        'gamezero-title': 'GameZero',
        'gamezero-description': 'GameZero is a React web application that allows users to manage their completed games.',
        
        'parcero-title': 'Parcero Real Estate',
        'parcero-description': 'RESTful API for real estate property management.',

        // Contact Section
        'contact-title': 'Contact',
        'name-label': 'Your Name',
        'email-label': 'Your Email',
        'message-label': 'Your Message',
        'send-button': 'Send Message',

        // Footer
        'footer-text': '© 2024 William Silva'
    }
};

// Função para atualizar o texto de um elemento
function updateText(selector, key) {
    const element = document.querySelector(selector);
    if (element) {
        element.textContent = translations[currentLang][key];
    }
}

// Função para atualizar placeholders
function updatePlaceholder(selector, key) {
    const element = document.querySelector(selector);
    if (element) {
        element.placeholder = translations[currentLang][key];
    }
}

// Função para atualizar atributos aria-label
function updateAriaLabel(selector, key) {
    const element = document.querySelector(selector);
    if (element) {
        element.setAttribute('aria-label', translations[currentLang][key]);
    }
}

// Função para atualizar o conteúdo dos projetos
function updateProjectsContent() {
    const projects = {
        'lolversus': document.querySelector('[aria-label="lolversus"]'),
        'quizquest': document.querySelector('[aria-label="quizquest"]'),
        'autovideo': document.querySelector('[aria-label="autovideo"]'),
        'gamezero': document.querySelector('[aria-label="gamezero"]'),
        'parcero': document.querySelector('[aria-label="parcero"]')
    };

    Object.entries(projects).forEach(([key, element]) => {
        if (element) {
            const title = element.querySelector('h3');
            const description = element.querySelector('p');
            const link = element.querySelector('a');
            
            if (title) title.textContent = translations[currentLang][`${key}-title`];
            if (description) description.textContent = translations[currentLang][`${key}-description`];
            if (link) link.textContent = translations[currentLang]['view-github'];
        }
    });
}

// Função principal para trocar o idioma
function setLanguage(lang) {
    currentLang = lang;
    
    // Atualiza textos do header
    updateText('h1', 'welcome');
    document.querySelectorAll('nav a').forEach(link => {
        const key = link.getAttribute('href').replace('#', '');
        link.textContent = translations[lang][key];
    });

    // Atualiza seção Sobre
    updateText('#about h2', 'about-title');
    updateText('#about p:first-of-type', 'about-p1');
    updateText('#about p:last-of-type', 'about-p2');

    // Atualiza seção Projetos
    updateText('#projects h2', 'projects-title');
    document.querySelectorAll('.carousel-card a').forEach(link => {
        link.textContent = translations[lang]['view-github'];
    });

    // Atualiza seção Contato
    updateText('#contact h2', 'contact-title');
    updateText('label[for="name"]', 'name-label');
    updateText('label[for="email"]', 'email-label');
    updateText('label[for="message"]', 'message-label');
    updateText('.submit-btn', 'send-button');

    // Atualiza footer
    updateText('footer p', 'footer-text');

    // Atualiza aria-labels
    document.querySelectorAll('[aria-label]').forEach(element => {
        const key = element.getAttribute('data-aria-key');
        if (key) {
            updateAriaLabel(`[data-aria-key="${key}"]`, key);
        }
    });

    // Atualiza conteúdo dos projetos
    updateProjectsContent();

    // Força a atualização do carousel
    const track = document.querySelector('.carousel-track');
    if (track) {
        const event = new Event('languagechange');
        track.dispatchEvent(event);
        
        // Atualiza o carousel imediatamente
        if (typeof updateCarousel === 'function') {
            updateCarousel(true);
        }
    }
}

// Inicializa com o idioma padrão
let currentLang = 'pt-br';
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
}); 