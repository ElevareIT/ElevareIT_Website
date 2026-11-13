(() => {
  'use strict';
  document.getElementById('year').textContent = String(new Date().getFullYear());
  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.getElementById('main-navigation');
  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    navigation.classList.remove('is-open');
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    navigation.classList.toggle('is-open', open);
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  const industries = {
    professional: { kicker: 'KEEP YOUR BEST WORK MOVING', title: 'More time for your clients. Less time on IT.', description: 'Client deadlines, distributed teams, and sensitive documents put a lot of demands on your systems. Start with dependable access and a clear way to get help.', priorities: ['Reliable access to client files', 'Secure collaboration across teams', 'A consistent support experience'] },
    healthcare: { kicker: 'SUPPORT THE PEOPLE BEHIND THE CARE', title: 'Technology that supports your care team.', description: 'Busy teams need dependable access to information. Make system availability, appropriate access, and the protection of sensitive records central to your IT plan.', priorities: ['Resilient access to essential systems', 'Thoughtful handling of sensitive information', 'Clear backup and recovery processes'] },
    financial: { kicker: 'CONFIDENCE IN EVERY CONNECTION', title: 'Keep trust at the centre of your systems.', description: 'Sensitive financial information deserves careful controls. Build your IT conversation around access, documentation, recovery, and the risks specific to your organisation.', priorities: ['Clear access controls and permissions', 'Secure document sharing', 'A documented approach to continuity'] },
    nonprofit: { kicker: 'MORE FOCUS ON YOUR MISSION', title: 'Make your technology go further.', description: 'Resources are precious. A practical technology plan can help your team coordinate its work, manage access for staff and volunteers, and choose where to invest next.', priorities: ['Simple, useful collaboration tools', 'Consistent staff and volunteer onboarding', 'A roadmap that respects your resources'] }
  };
  const tabs = Array.from(document.querySelectorAll('[data-industry]'));
  function activateIndustry(tab, moveFocus = false) {
    const item = industries[tab.dataset.industry];
    if (!item) return;
    tabs.forEach(button => {
      const selected = button === tab;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    document.getElementById('industry-kicker').textContent = item.kicker;
    document.getElementById('industry-title').textContent = item.title;
    document.getElementById('industry-description').textContent = item.description;
    const list = document.getElementById('industry-priorities');
    list.replaceChildren(...item.priorities.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
    document.getElementById('industry-panel').setAttribute('aria-labelledby', tab.id);
    if (moveFocus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateIndustry(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (index + 1) % tabs.length;
      if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      activateIndustry(tabs[next], true);
    });
  });

  const services = {
    managed: { title: 'Make everyday IT feel easier.', description: 'A managed IT conversation starts with the systems and support your team depends on. Map what you have, clarify responsibilities, and identify the improvements that can reduce everyday friction.', items: ['Device and infrastructure inventory', 'Support workflows and escalation responsibilities', 'Patching, maintenance, and monitoring priorities', 'Backup ownership and recovery planning'] },
    security: { title: 'Build a stronger foundation for security.', description: 'Security is a continuing practice. Start by understanding how people access your systems, where important information lives, and how your team would respond to an incident.', items: ['Multi-factor authentication and access reviews', 'Device protection and update habits', 'Staff awareness and phishing readiness', 'A documented incident response and recovery plan'] },
    cloud: { title: 'Give collaboration a clearer home.', description: 'Cloud tools are most useful when they fit the way your team works. Review how information is organised, shared, protected, and recovered before choosing the next change.', items: ['Collaboration and file-sharing requirements', 'Permissions, ownership, and account lifecycle', 'Migration dependencies and continuity', 'Cloud backup and recovery responsibilities'] },
    strategy: { title: 'Connect your IT plan to what comes next.', description: 'A useful IT roadmap gives technology decisions a business reason. Bring your current systems, upcoming changes, and team needs into one prioritised plan.', items: ['An overview of current systems and contracts', 'Business goals and upcoming changes', 'Risk, cost, and impact prioritisation', 'Clear owners, milestones, and review points'] }
  };
  const serviceDialog = document.getElementById('service-dialog');
  document.querySelectorAll('[data-service]').forEach(button => button.addEventListener('click', () => {
    const service = services[button.dataset.service];
    document.getElementById('service-dialog-title').textContent = service.title;
    document.getElementById('service-dialog-description').textContent = service.description;
    document.getElementById('service-dialog-list').replaceChildren(...service.items.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
    serviceDialog.showModal();
  }));
  document.querySelector('[data-open-privacy]').addEventListener('click', () => document.getElementById('privacy-dialog').showModal());
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
  });
  document.getElementById('service-dialog-cta').addEventListener('click', () => serviceDialog.close());
})();
