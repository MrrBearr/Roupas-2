/* Aviso de contato usado por todos os CTAs dos projetos demonstrativos. */
(() => {
  'use strict';

  const contactLinks = Array.from(document.querySelectorAll('a[href*="wa.me/"], a[href="#demo-contact-dialog"]'));
  if (!contactLinks.length) return;

  const projectName = document.title.split('—')[0].trim();
  const contactUrl = `https://wa.me/5583921483515?text=${encodeURIComponent(`Olá, Caio! Vi a demonstração da ${projectName} e quero conversar sobre um site para o meu negócio.`)}`;
  const dialog = document.createElement('dialog');
  const panel = document.createElement('div');
  const eyebrow = document.createElement('p');
  const title = document.createElement('h2');
  const description = document.createElement('p');
  const actions = document.createElement('div');
  const contactButton = document.createElement('a');
  const continueButton = document.createElement('button');

  dialog.id = 'demo-contact-dialog';
  dialog.className = 'demo-contact-dialog';
  dialog.setAttribute('aria-labelledby', 'demo-contact-title');
  dialog.setAttribute('aria-describedby', 'demo-contact-description');

  panel.className = 'demo-contact-dialog__panel';
  eyebrow.className = 'demo-contact-dialog__eyebrow';
  eyebrow.textContent = 'Projeto demonstrativo';
  title.id = 'demo-contact-title';
  title.className = 'demo-contact-dialog__title';
  title.textContent = 'Esta ação é apenas uma simulação.';
  description.id = 'demo-contact-description';
  description.className = 'demo-contact-dialog__description';
  description.textContent = 'Em um site real, este botão poderia iniciar uma reserva, um pedido ou o atendimento do negócio. Nesta demonstração, nenhuma solicitação será enviada.';

  actions.className = 'demo-contact-dialog__actions';
  contactButton.className = 'demo-contact-dialog__button demo-contact-dialog__button--primary';
  contactButton.href = contactUrl;
  contactButton.target = '_blank';
  contactButton.rel = 'noopener noreferrer';
  contactButton.textContent = 'Quero um site assim';
  continueButton.className = 'demo-contact-dialog__button demo-contact-dialog__button--secondary';
  continueButton.type = 'button';
  continueButton.textContent = 'Continuar explorando';

  actions.append(contactButton, continueButton);
  panel.append(eyebrow, title, description, actions);
  dialog.append(panel);
  document.body.append(dialog);

  let lastTrigger = null;
  let previousOverflow = '';

  const restorePage = () => {
    document.body.style.overflow = previousOverflow;
    if (lastTrigger && typeof lastTrigger.focus === 'function') lastTrigger.focus();
  };

  const closeDialog = () => {
    if (!dialog.hasAttribute('open')) return;
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
      restorePage();
    }
  };

  const openDialog = (trigger) => {
    lastTrigger = trigger;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    window.requestAnimationFrame(() => contactButton.focus());
  };

  contactLinks.forEach((link) => {
    link.href = '#demo-contact-dialog';
    link.removeAttribute('target');
    link.removeAttribute('rel');
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-controls', dialog.id);
    link.addEventListener('click', (event) => {
      event.preventDefault();
      openDialog(link);
    });
  });

  continueButton.addEventListener('click', closeDialog);
  contactButton.addEventListener('click', closeDialog);
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeDialog();
  });
  dialog.addEventListener('close', restorePage);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });

  document.addEventListener('keydown', (event) => {
    if (!dialog.hasAttribute('open') || typeof dialog.showModal === 'function') return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDialog();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusables = [contactButton, continueButton];
    const currentIndex = focusables.indexOf(document.activeElement);
    const nextIndex = event.shiftKey
      ? (currentIndex <= 0 ? focusables.length - 1 : currentIndex - 1)
      : (currentIndex === focusables.length - 1 ? 0 : currentIndex + 1);
    event.preventDefault();
    focusables[nextIndex].focus();
  });
})();
