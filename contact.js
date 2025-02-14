document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando formulário de contato...');
    
    try {
        emailjs.init("WJdvaKoi-AULl6wR8");
        console.log('EmailJS inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar EmailJS:', error);
    }

    const form = document.getElementById('contactForm');
    const submitButton = form.querySelector('.submit-btn');
    const buttonText = submitButton.querySelector('.btn-text');
    const loadingSpinner = submitButton.querySelector('.loading-spinner');

    function setLoading(isLoading) {
        console.log('Estado de loading:', isLoading);
        if (submitButton && buttonText && loadingSpinner) {
            submitButton.disabled = isLoading;
            buttonText.style.display = isLoading ? 'none' : 'block';
            loadingSpinner.style.display = isLoading ? 'block' : 'none';
        } else {
            console.error('Elementos de loading não encontrados:', {
                submitButton: !!submitButton,
                buttonText: !!buttonText,
                loadingSpinner: !!loadingSpinner
            });
        }
    }

    submitButton.addEventListener('click', async function(e) {
        console.log('Botão clicado');
        
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const message = form.message.value.trim();

        console.log('Dados do formulário:', {
            name,
            email,
            messageLength: message.length
        });

        if (!name || !email || !message) {
            console.warn('Validação falhou: campos vazios');
            showNotification('form-empty-fields', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            console.warn('Validação falhou: email inválido -', email);
            showNotification('form-invalid-email', 'error');
            return;
        }

        setLoading(true);
        console.log('Iniciando processo de envio...');
        showNotification('form-sending', 'info');

        try {
            console.log('Tentando enviar email via EmailJS...');
            const response = await emailjs.send(
                'service_1anqg7d', 
                'template_r5rlaii', 
                {
                    from_name: name,
                    from_email: email,
                    message: message,
                    to_email: 'williamhss90@gmail.com'
                }
            );
            
            console.log('Resposta do EmailJS:', response);
            showNotification('form-success', 'success');
            form.reset();
            
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            showNotification('form-error', 'error');
        } finally {
            setLoading(false);
        }
    });

    function showNotification(messageKey, type) {
        const message = translations[currentLang][messageKey];
        console.log(`Mostrando notificação: ${type} - ${message}`);
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        const oldNotification = document.querySelector('.notification');
        if (oldNotification) {
            console.log('Removendo notificação antiga');
            oldNotification.remove();
        }
        
        form.parentNode.insertBefore(notification, form);
        
        setTimeout(() => {
            console.log('Iniciando remoção da notificação');
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
                console.log('Notificação removida');
            }, 300);
        }, 5000);
    }

    function isValidEmail(email) {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        console.log('Validação de email:', { email, isValid });
        return isValid;
    }

    // Gerenciamento de placeholder
    const formInputs = form.querySelectorAll('input, textarea');
    
    formInputs.forEach(input => {
        // Guarda o placeholder original
        const originalPlaceholder = input.placeholder;
        
        // Remove o placeholder ao focar
        input.addEventListener('focus', () => {
            input.placeholder = '';
        });
        
        // Restaura o placeholder se o campo estiver vazio ao perder o foco
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.placeholder = originalPlaceholder;
            }
        });
    });

    console.log('Configuração do formulário de contato concluída');
}); 