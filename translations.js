const translations = {
    'pt-br': {
        welcome: 'Bem-vindo ao Meu Portfólio',
        about: 'Sobre Mim',
        projects: 'Projetos',
        contact: 'Contato',
        project1: 'Projeto 1',
        project1Description: 'Descrição do projeto 1.',
        project2: 'Projeto 2',
        project2Description: 'Descrição do projeto 2.',
        viewOnGitHub: 'Ver no GitHub',
        // Adicione mais traduções conforme necessário
    },
    'en-us': {
        welcome: 'Welcome to My Portfolio',
        about: 'About Me',
        projects: 'Projects',
        contact: 'Contact',
        project1: 'Project 1',
        project1Description: 'Description of project 1.',
        project2: 'Project 2',
        project2Description: 'Description of project 2.',
        viewOnGitHub: 'View on GitHub',
        // Adicione mais traduções conforme necessário
    }
};

function translate(language, key) {
    return translations[language][key] || key;
} 