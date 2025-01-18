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
      const container = document.createElement("div");
      container.id = "whois-button-container";
      container.style = "display: flex; flex-direction: column; align-items: center; gap: 10px; margin-top: 10px;";

      const createButton = (href, text) => {
        const link = document.createElement("a");
        link.href = href;
        link.target = "_blank";
        link.style = "padding: 10px 20px; background-color: #56a845; color: #fff; text-decoration: none; border-radius: 5px; font-size: 20px; cursor: pointer;";
        link.textContent = text;
        return link;
      };

      container.appendChild(createButton(`https://registro.br/tecnologia/ferramentas/whois?search=${encodeURIComponent(domain)}`, "Consultar proprietário no Whois"));
      container.appendChild(createButton(`https://${encodeURIComponent(domain)}`, "Abrir website"));
      afterElement.parentNode.insertBefore(container, afterElement.nextSibling);
    };

    observeElement("p.is-avail-response-not-available", (element, domainName) => {
      const infoTextElement = document.querySelector("div.info.font-4 > p");
      const infoText = infoTextElement ? infoTextElement.innerText.trim() : null;

      if (infoText !== "Domínio já registrado") {
        return;
      }

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
