/* Fee Veraghtert — thema-scripts */

(function () {
   'use strict';

   document.addEventListener('DOMContentLoaded', function () {
      var form = document.querySelector('.contact-form');

      if (!form) {
         return;
      }

      var status = form.querySelector('.contact-form__status');
      var btn = form.querySelector('.contact-form__submit');
      var keyInput = form.querySelector('input[name="access_key"]');
      var hasKey = !!(keyInput && keyInput.value);

      function setStatus(text, cls) {
         status.textContent = text;
         status.className = 'contact-form__status' + (cls ? ' ' + cls : '');
      }

      /* Mailto-fallback: zonder Web3Forms-code opent het formulier
         gewoon de e-mailapp van de bezoeker met alles netjes ingevuld. */
      function sendViaMailClient() {
         var data = new FormData(form);
         var to = form.getAttribute('data-fallback-email') || '';
         var subject = data.get('subject') || 'Contact via feeveraghtert.com';
         var body =
            'Name: ' + (data.get('name') || '') + '\n' +
            'E-mail: ' + (data.get('email') || '') + '\n\n' +
            (data.get('message') || '');

         setStatus('Your e-mail app is being opened…', 'contact-form__status--ok');
         window.location.href = 'mailto:' + to +
            '?subject=' + encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(body);
      }

      form.addEventListener('submit', function (ev) {
         ev.preventDefault();

         if (!hasKey) {
            sendViaMailClient();
            return;
         }

         btn.disabled = true;
         btn.textContent = 'Sending…';
         setStatus('', '');

         fetch(form.action, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: new FormData(form)
         })
            .then(function (res) {
               return res.json().then(function (data) {
                  return { ok: res.ok, data: data };
               });
            })
            .then(function (r) {
               if (r.ok && r.data.success) {
                  form.reset();
                  setStatus('Thank you — your message has been sent.', 'contact-form__status--ok');
               } else {
                  setStatus('Sorry, something went wrong. Please send an e-mail instead.', 'contact-form__status--err');
               }
            })
            .catch(function () {
               setStatus('Sorry, something went wrong. Please send an e-mail instead.', 'contact-form__status--err');
            })
            .then(function () {
               btn.disabled = false;
               btn.textContent = 'Send';
            });
      });
   });
})();
