(() => {
  'use strict';

  const sectors = new Map([
    ['professional', 'Professional services'],
    ['healthcare', 'Healthcare'],
    ['financial', 'Financial services'],
    ['manufacturing', 'Manufacturing & distribution'],
    ['nonprofit', 'Nonprofit'],
    ['other', 'Another industry'],
  ]);
  const sizes = new Map([
    ['1-10', '1–10 people'],
    ['11-50', '11–50 people'],
    ['51-200', '51–200 people'],
    ['201+', '201+ people'],
  ]);
  const priorities = new Map([
    ['reliability', {
      title: 'Keep the everyday running',
      label: 'Reliable IT & support',
      description: 'Fewer interruptions. A clearer plan for support.',
      actions: [
        'List the systems your team needs every day, and record recurring issues and who owns each one.',
        'Check when your last successful backup restore was tested; schedule a documented test if the date is unknown.',
        'Agree how urgent issues are reported, prioritised, and escalated with your support team.',
      ],
    }],
    ['security', {
      title: 'Build a practical security baseline',
      label: 'Cybersecurity & resilience',
      description: 'Understand your exposure and your next steps.',
      actions: [
        'Review multi-factor authentication, administrator access, and the process for removing former staff accounts.',
        'Check which devices receive security updates and identify anyone responsible for following up on exceptions.',
        'Write down who your team should contact during a suspected incident and where that plan can be found.',
      ],
    }],
    ['cloud', {
      title: 'Make cloud tools work together',
      label: 'Cloud & collaboration',
      description: 'Make sharing, access, and remote work simpler.',
      actions: [
        'Map where important files live, who can access them, and which tools duplicate the same work.',
        'Review external sharing, retention, and recovery settings for your cloud workspaces.',
        'Choose one recurring collaboration problem and agree a small pilot before changing tools across the business.',
      ],
    }],
    ['growth', {
      title: 'Plan the next stage with confidence',
      label: 'Growth, strategy & costs',
      description: 'Connect technology decisions to business priorities.',
      actions: [
        'List upcoming hiring, location, and business changes that could affect your systems over the next year.',
        'Bring software renewals, support agreements, and hardware replacement dates into one spending calendar.',
        'Rank proposed improvements by business impact, effort, and urgency before agreeing a realistic roadmap.',
      ],
    }],
  ]);

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function init() {
    const mount = document.getElementById('review-app');
    if (!mount || mount.dataset.reviewMounted === 'true') return;
    mount.dataset.reviewMounted = 'true';

    const state = { organisation: '', sector: '', size: '', priorities: [], context: '' };
    let currentStep = 1;

    const getSelected = () => state.priorities.filter((key) => priorities.has(key));

    function button(text, className, onClick, type = 'button') {
      const node = element('button', className, text);
      node.type = type;
      if (onClick) node.addEventListener('click', onClick);
      return node;
    }

    function progress() {
      const nav = element('ol', 'review-progress');
      nav.setAttribute('aria-label', 'IT review progress');
      ['Your business', 'Your priorities', 'Your brief'].forEach((label, index) => {
        const item = element('li', 'review-step-indicator');
        item.append(element('span', 'review-step-number', String(index + 1).padStart(2, '0')));
        item.append(element('span', '', label));
        if (currentStep === index + 1) {
          item.classList.add('is-active');
          item.setAttribute('aria-current', 'step');
        } else if (currentStep > index + 1) {
          item.classList.add('is-complete');
        }
        nav.append(item);
      });
      return nav;
    }

    function heading(parent, title, subtitle) {
      const titleNode = element('h3', 'review-step-heading', title);
      titleNode.tabIndex = -1;
      parent.append(titleNode);
      if (subtitle) parent.append(element('p', 'review-step-description', subtitle));
      return titleNode;
    }

    function field(parent, { id, label, type = 'text', options, value = '', required = false, maxLength }) {
      const wrap = element('div', 'field');
      const labelNode = element('label', '', label);
      labelNode.htmlFor = id;
      let input;
      if (options) {
        input = document.createElement('select');
        const initial = element('option', '', 'Select an option');
        initial.value = '';
        initial.disabled = true;
        input.append(initial);
        options.forEach((text, key) => {
          const option = element('option', '', text);
          option.value = key;
          input.append(option);
        });
      } else if (type === 'textarea') {
        input = document.createElement('textarea');
        input.rows = 4;
      } else {
        input = document.createElement('input');
        input.type = type;
      }
      input.id = id;
      input.name = id;
      input.value = value;
      input.required = required;
      if (maxLength) input.maxLength = maxLength;
      wrap.append(labelNode, input);
      parent.append(wrap);
      return input;
    }

    function privacy(parent) {
      parent.append(element('p', 'review-privacy', 'Your answers stay in this browser. Nothing is sent.'));
    }

    function validForm(form) {
      const firstInvalid = Array.from(form.elements).find((input) => input.willValidate && !input.checkValidity());
      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.reportValidity();
        return false;
      }
      return true;
    }

    function renderBusiness(section) {
      const title = heading(section, 'Let’s start with your business.', 'A little context helps make your next steps more useful.');
      const form = element('form', 'review-form');
      form.noValidate = true;
      const grid = element('div', 'form-grid');
      const organisation = field(grid, {
        id: 'review-organisation', label: 'Organisation name (optional)', value: state.organisation, maxLength: 100,
      });
      organisation.autocomplete = 'organization';
      const sector = field(grid, {
        id: 'review-sector', label: 'Your industry', options: sectors, value: state.sector, required: true,
      });
      const size = field(grid, {
        id: 'review-size', label: 'Team size', options: sizes, value: state.size, required: true,
      });
      form.append(grid);
      const actions = element('div', 'form-actions');
      actions.append(button('Choose your priorities →', 'button button-primary', null, 'submit'));
      form.append(actions);
      privacy(form);
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!validForm(form)) return;
        if (!sectors.has(sector.value) || !sizes.has(size.value)) return;
        state.organisation = organisation.value.trim().slice(0, 100);
        state.sector = sector.value;
        state.size = size.value;
        currentStep = 2;
        render(true);
      });
      section.append(form);
      return title;
    }

    function renderPriorities(section) {
      const title = heading(section, 'What would you like to improve?', 'Choose the areas that matter most. We’ll turn them into a practical planning brief.');
      const form = element('form', 'review-form');
      const fieldset = element('fieldset', 'review-priority-fields');
      const legend = element('legend', '', 'Your priorities — choose at least one');
      fieldset.append(legend);
      const grid = element('div', 'review-priorities');
      const error = element('p', 'review-error');
      error.id = 'review-priority-error';
      error.setAttribute('role', 'alert');
      error.hidden = true;
      fieldset.setAttribute('aria-describedby', error.id);
      const checks = [];
      priorities.forEach((priority, key) => {
        const label = element('label', 'priority-choice');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'review-priority';
        checkbox.value = key;
        checkbox.className = 'priority-checkbox';
        checkbox.checked = state.priorities.includes(key);
        const copy = element('span', 'priority-copy');
        copy.append(element('strong', '', priority.label), element('span', '', priority.description));
        label.append(checkbox, copy);
        grid.append(label);
        checks.push(checkbox);
        checkbox.addEventListener('change', () => {
          if (checks.some((check) => check.checked)) {
            error.hidden = true;
            fieldset.removeAttribute('aria-invalid');
          }
        });
      });
      fieldset.append(grid, error);
      form.append(fieldset);
      const context = field(form, {
        id: 'review-context', label: 'Anything else on your mind? (optional)', type: 'textarea', value: state.context, maxLength: 1200,
      });
      context.placeholder = 'A recurring issue, a planned move, a new way of working…';
      const save = () => {
        state.priorities = checks.filter((check) => check.checked && priorities.has(check.value)).map((check) => check.value);
        state.context = context.value.trim().slice(0, 1200);
      };
      const actions = element('div', 'form-actions');
      actions.append(
        button('← Back', 'button button-outline', () => { save(); currentStep = 1; render(true); }),
        button('Create my review brief', 'button button-primary', null, 'submit'),
      );
      form.append(actions);
      privacy(form);
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        save();
        if (!state.priorities.length) {
          error.textContent = 'Choose at least one priority to create your brief.';
          error.hidden = false;
          fieldset.setAttribute('aria-invalid', 'true');
          checks[0].focus();
          return;
        }
        if (!validForm(form)) return;
        currentStep = 3;
        render(true);
      });
      section.append(form);
      return title;
    }

    function nextConversation() {
      const scale = state.size === '201+'
        ? 'Choose a representative from each business function to help prioritise the roadmap and agree ownership.'
        : state.size === '51-200'
          ? 'Ask team leads to identify shared pain points, then agree one business owner for your initial review.'
          : 'Choose one person to gather account ownership, supplier details, and the team’s most common IT frustrations.';
      return [
        scale,
        'Bring your current system list, support arrangements, renewal dates, and the priorities in this brief to your next IT planning conversation.',
        'Agree a first action, an owner, and a review date so the discussion leads to a clear next step.',
      ];
    }

    function briefText() {
      const lines = [
        'ELEVARE IT — YOUR IT REVIEW BRIEF',
        'Technology with a Purpose.',
        '',
        `Organisation: ${state.organisation || 'Not provided'}`,
        `Industry: ${sectors.get(state.sector) || 'Not provided'}`,
        `Team size: ${sizes.get(state.size) || 'Not provided'}`,
        '',
        'This planning brief is based on the priorities you selected.',
        '',
      ];
      getSelected().forEach((key) => {
        const priority = priorities.get(key);
        lines.push(priority.title.toUpperCase());
        priority.actions.forEach((action) => lines.push(`[ ] ${action}`));
        lines.push('');
      });
      if (state.context) lines.push('YOUR ADDITIONAL CONTEXT', state.context, '');
      lines.push('PREPARE FOR YOUR NEXT IT CONVERSATION');
      nextConversation().forEach((action) => lines.push(`[ ] ${action}`));
      lines.push('', 'Your answers were used in your browser to create this file. Nothing was sent.');
      return lines.join('\n');
    }

    function download() {
      const blob = new Blob([briefText()], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const slug = state.organisation.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50);
      link.href = url;
      link.download = `${slug || 'elevare'}-it-review-brief.txt`;
      link.hidden = true;
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function checklist(parent, title, actions) {
      const block = element('section', 'review-priority-result');
      block.append(element('h4', '', title));
      const list = element('ul', 'review-checklist');
      actions.forEach((action) => list.append(element('li', '', action)));
      block.append(list);
      parent.append(block);
    }

    function renderResult(section) {
      const title = heading(section, 'Your next steps, made clearer.', 'Your planning brief is ready. Save it to share with your team or IT provider.');
      const result = element('div', 'review-result');
      const summary = element('p', 'review-business-summary');
      summary.append(element('strong', '', state.organisation || 'Your business'));
      summary.append(document.createTextNode(` · ${sectors.get(state.sector)} · ${sizes.get(state.size)}`));
      result.append(summary);
      result.append(element('p', 'review-result-intro', 'Use these actions as a starting point for your IT planning conversation.'));
      getSelected().forEach((key) => {
        const priority = priorities.get(key);
        checklist(result, priority.title, priority.actions);
      });
      if (state.context) {
        const contextBlock = element('section', 'review-context-result');
        contextBlock.append(element('h4', '', 'Your additional context'), element('p', '', state.context));
        result.append(contextBlock);
      }
      checklist(result, 'Bring the right people and information together', nextConversation());
      const actions = element('div', 'form-actions');
      actions.append(
        button('Download my brief ↓', 'button button-primary', download),
        button('Edit my priorities', 'button button-outline', () => { currentStep = 2; render(true); }),
      );
      result.append(actions);
      const reset = button('Start a new review', 'review-reset', () => {
        state.organisation = '';
        state.sector = '';
        state.size = '';
        state.priorities = [];
        state.context = '';
        currentStep = 1;
        render(true);
      });
      result.append(reset);
      privacy(result);
      section.append(result);
      return title;
    }

    function render(moveFocus = false) {
      const section = element('div', 'review-step');
      section.dataset.step = String(currentStep);
      let title;
      if (currentStep === 1) title = renderBusiness(section);
      else if (currentStep === 2) title = renderPriorities(section);
      else title = renderResult(section);
      mount.replaceChildren(progress(), section);
      if (moveFocus) title.focus({ preventScroll: false });
    }

    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
