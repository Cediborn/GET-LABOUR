// GLCL form submission handler.
// Delivery path: EmailJS (same service already used on the company's previous
// website). If delivery fails for any reason, the visitor is offered a
// pre-filled email to the company address — we never fake a success state.
import emailjs from '@emailjs/browser';

const loadedAt = Date.now();

/**
 * Map a form's fields into the EmailJS template variables used by GLCL's
 * existing template, plus a full formatted `message` body.
 */
function buildPayload(form) {
  const data = new FormData(form);
  const kind = form.dataset.glclForm;
  const val = (name) => String(data.get(name) ?? '').trim();
  const all = (name) => data.getAll(name).map((v) => String(v).trim()).filter(Boolean);

  const time = new Date().toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const lines = [];
  let fullname = val('fullname');
  let company = val('company');
  let email = val('email');
  let phone = val('phone');
  let labourType = '—';
  let skilledLabour = '—';
  let nonSkilledLabour = '—';
  let menCount = '—';

  if (kind === 'request') {
    const categoryLabels = all('labourCategory');
    labourType = categoryLabels.length ? categoryLabels.join('; ') : '—';
    const roles = all('skilledRole');
    const gangs = all('gangType');
    skilledLabour = roles.length ? roles.join(', ') : '—';
    nonSkilledLabour = gangs.length ? gangs.join(', ') : '—';
    menCount = val('workerCount') || '—';

    lines.push(
      ['Submitted via', 'GLCL website — Labour request form'],
      ['Contact person', fullname],
      ['Company / organisation', company || '—'],
      ['Labour category', labourType],
      ['Specific roles', skilledLabour],
      ['Gang types', nonSkilledLabour],
      ['Workers required', menCount],
      ['Type of operation', val('operationType') || '—'],
      ['Preferred start date', val('startDate') || '—'],
      ['Expected duration', val('duration') || '—'],
      ['Work location', val('workLocation') || '—'],
      ['Requirements / notes', val('description') || '—'],
      ['Skills or equipment experience', val('skills') || '—'],
      ['Preferred contact method', val('preferredContact') || '—'],
      ['Telephone', phone || '—'],
      ['Email', email || '—'],
      ['Submitted', time]
    );
  } else if (kind === 'apply') {
    fullname = val('fullname');
    company = 'Employment application — GLCL website';
    labourType = val('workCategory') || '—';
    const equipment = all('equipmentExperience');
    skilledLabour = val('skills') || '—';
    nonSkilledLabour = [
      equipment.length ? `Equipment: ${equipment.join(', ')}` : '',
      val('certifications') ? `Certifications: ${val('certifications')}` : '',
      val('location') ? `Location: ${val('location')}` : '',
    ]
      .filter(Boolean)
      .join(' | ') || '—';
    menCount = '—';

    lines.push(
      ['Submitted via', 'GLCL website — Employment application'],
      ['Full name', fullname],
      ['Preferred work category', labourType],
      ['Skills / work experience', val('skills') || '—'],
      ['Certifications / qualifications', val('certifications') || '—'],
      ['Equipment experience', equipment.length ? equipment.join(', ') : '—'],
      ['General location', val('location') || '—'],
      ['Personal statement', val('statement') || '—'],
      ['Telephone', phone || '—'],
      ['Email', email || '—'],
      ['Submitted', time]
    );
  } else {
    company = 'General enquiry — GLCL website';
    lines.push(
      ['Submitted via', 'GLCL website — Contact page'],
      ['Name', fullname],
      ['Message', val('message') || '—'],
      ['Telephone', phone || '—'],
      ['Email', email || '—'],
      ['Submitted', time]
    );
  }

  const message = lines.map(([k, v]) => `${k}: ${v}`).join('\n');

  return {
    template: {
      fullname: fullname || '—',
      company: company || '—',
      email: email || '—',
      phone: phone || '—',
      labourType,
      skilledLabour,
      nonSkilledLabour,
      menCount,
      topsideMenCount: '—',
      time,
      message,
    },
    subject:
      kind === 'request'
        ? `Labour request — ${company || fullname || 'GLCL website'}`
        : kind === 'apply'
          ? `Employment application — ${fullname}`
          : `Website enquiry — ${fullname}`,
  };
}

function mailtoLink(email, subject, message) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}

function setInvalid(input, invalid) {
  const field = input.closest('.field');
  if (!field) return;
  field.classList.toggle('is-invalid', invalid);
  input.setAttribute('aria-invalid', invalid ? 'true' : 'false');
  const error = field.querySelector('.field-error');
  if (error && invalid && !error.textContent.trim()) {
    error.textContent = 'This field is required.';
  }
}

function validate(form) {
  let ok = true;
  let firstInvalid = null;
  form.querySelectorAll('input, select, textarea').forEach((input) => {
    if (input.name === 'company_website') return;
    const invalid = !input.checkValidity();
    setInvalid(input, invalid);
    if (invalid) {
      ok = false;
      if (!firstInvalid) firstInvalid = input;
    }
  });
  if (firstInvalid) firstInvalid.focus({ preventScroll: false });
  return ok;
}

function findAlert(form) {
  return (
    form.querySelector('.form-alert') ||
    form.closest('.form-panel')?.querySelector('.form-alert') ||
    document.querySelector(`form[data-glcl-form="${form.dataset.glclForm}"] ~ .form-alert`)
  );
}

function showAlert(form, type, html) {
  const alertEl = findAlert(form);
  if (!alertEl) return;
  alertEl.hidden = false;
  alertEl.className = `form-alert form-alert--${type} is-visible`;
  alertEl.innerHTML = `<span class="form-alert__icon" aria-hidden="true">${
    type === 'success' ? '✓' : type === 'error' ? '!' : 'i'
  }</span><div>${html}</div>`;
  alertEl.setAttribute('role', type === 'error' ? 'alert' : 'status');
  alertEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function initForm(form) {
  const kind = form.dataset.glclForm;
  const submitBtn = form.querySelector('[type="submit"]');
  const successPanel = document.querySelector(`[data-success-for="${kind}"]`);
  const config = {
    publicKey: form.dataset.emailjsPublic || '',
    serviceId: form.dataset.emailjsService || '',
    templateId: form.dataset.emailjsTemplate || '',
  };
  const companyEmail = form.dataset.companyEmail || 'getlabourcompanylimited@gmail.com';

  // Live-clear invalid state as the visitor fixes fields.
  form.addEventListener('input', (e) => {
    const t = e.target;
    if (t instanceof HTMLElement && t.matches('input, select, textarea')) {
      if (t.checkValidity()) setInvalid(t, false);
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Simple bot trap: real visitors never fill this hidden field.
    const honeypot = form.querySelector('[name="company_website"]');
    if (honeypot && honeypot.value) return;

    // Discourage sub-second automated submissions.
    if (Date.now() - loadedAt < 1500) {
      showAlert(
        form,
        'info',
        '<p>Please take a moment to review your details, then press send again.</p>'
      );
      return;
    }

    if (!validate(form)) {
      showAlert(
        form,
        'error',
        '<p>Please complete the highlighted fields before sending.</p>'
      );
      return;
    }

    const { template, subject } = buildPayload(form);

    if (!config.publicKey || !config.serviceId || !config.templateId) {
      // No delivery service configured — offer the email route honestly.
      showAlert(
        form,
        'info',
        `<p><strong>Online sending is not active on this site yet.</strong> Your details have not been sent automatically — please send them by email instead:</p>
         <p><a href="${mailtoLink(companyEmail, subject, template.message)}">Open a pre-filled email to GLCL</a></p>`
      );
      return;
    }

    submitBtn?.setAttribute('aria-busy', 'true');
    if (submitBtn instanceof HTMLButtonElement) submitBtn.disabled = true;

    try {
      await emailjs.send(config.serviceId, config.templateId, template, {
        publicKey: config.publicKey,
      });
      form.hidden = true;
      if (successPanel) {
        successPanel.classList.add('is-visible');
        successPanel.setAttribute('tabindex', '-1');
        successPanel.focus();
      }
    } catch (err) {
      console.error('GLCL form delivery failed:', err);
      showAlert(
        form,
        'error',
        `<p><strong>We could not send this automatically.</strong> Your details are still here in the form — nothing was lost. You can send them by email or call us directly:</p>
         <p><a href="${mailtoLink(companyEmail, subject, template.message)}">Open a pre-filled email to GLCL</a> ·
         <a href="tel:+233303961288">+233 30 396 1288</a></p>`
      );
    } finally {
      submitBtn?.removeAttribute('aria-busy');
      if (submitBtn instanceof HTMLButtonElement) submitBtn.disabled = false;
    }
  });
}

document.querySelectorAll('form[data-glcl-form]').forEach(initForm);
