(() => {
  let lastUrl = location.href;
  let processedDomain = "";

  const init = () => {
    const observeElement = (selector, callback) => {
      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          const domainElement = document.querySelector("strong.is-avail-response-fqdn");
          const domainName = domainElement ? domainElement.innerText.trim() : null;

          if (domainName && domainName !== processedDomain) {
            processedDomain = domainName;
            callback(element, domainName);
          }
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    };

    const removeWhoisButton = () => {
      document.getElementById("whois-button-container")?.remove();
    };

    const addWhoisButton = (afterElement, domain) => {
      removeWhoisButton();
      afterElement.insertAdjacentHTML(
        "afterend",
        `<div id="whois-button-container" style="display: flex; justify-content: center; margin-top: 10px;">
          <a href="https://registro.br/tecnologia/ferramentas/whois?search=${encodeURIComponent(domain)}" 
             target="_blank" style="padding: 10px 20px; background-color: #56a845; color: #fff; text-decoration: none;
             border-radius: 5px; font-size: 20px; cursor: pointer;">
            Consultar proprietário no Whois
          </a>
        </div>`
      );
    };

    observeElement("p.is-avail-response-not-available", (element, domainName) => {
      addWhoisButton(element, domainName);
    });

    observeElement("p.is-avail-response-available", () => {
      removeWhoisButton();
    });
  };

  const detectUrlChange = () => {
    if (lastUrl !== location.href) {
      lastUrl = location.href;
      processedDomain = "";
      removeWhoisButton();
      window.addEventListener(
        "load",
        () => {
          init();
        },
        { once: true }
      );
    }
  };

  window.addEventListener("popstate", detectUrlChange);
  history.pushState = ((f) => function pushState(...args) {
    const ret = f.apply(this, args);
    detectUrlChange();
    return ret;
  })(history.pushState);
  history.replaceState = ((f) => function replaceState(...args) {
    const ret = f.apply(this, args);
    detectUrlChange();
    return ret;
  })(history.replaceState);

  init();
})();
