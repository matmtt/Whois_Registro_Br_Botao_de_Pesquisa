(() => {
  let lastUrl = location.href; 
  let processedDomain = "";

  const init = () => {
    console.log("Página carregada ou URL alterado. Iniciando script!");

    const observeElement = (selector, callback) => {
      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          const domainName = new URL(window.location.href).searchParams.get("fqdn");
          if (domainName !== processedDomain) 
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

    const normalizeDomain = (domain) => {
      if (domain.endsWith(".com.br")) {
        return domain;
      } else if (domain.endsWith(".com")) {
        return `${domain}.br`; 
      } else {
        return `${domain}.com.br`;
      }
    };

    const removeWhoisButton = () => {
      const existingButton = document.getElementById("whois-button-container");
      if (existingButton) {
        existingButton.remove();
      }
    };

    const addWhoisButton = (afterElement, domain) => {
      removeWhoisButton();

      const buttonContainer = document.createElement("div");
      buttonContainer.style.display = "flex";
      buttonContainer.style.justifyContent = "center";
      buttonContainer.style.marginTop = "10px";
      buttonContainer.id = "whois-button-container";

      const button = document.createElement("button");
      button.id = "whois-button";
      button.textContent = "Consultar proprietário no Whois";
      button.style.padding = "10px 20px";
      button.style.backgroundColor = "#56a845";
      button.style.color = "#fff";
      button.style.border = "none";
      button.style.borderRadius = "5px";
      button.style.cursor = "pointer";
      button.style.fontSize = "20px";

      button.addEventListener("click", () => {
        const whoisUrl = `https://registro.br/tecnologia/ferramentas/whois?search=${encodeURIComponent(domain)}`;
        window.open(whoisUrl, "_blank");
      });

      buttonContainer.appendChild(button);
      afterElement.parentNode.insertBefore(buttonContainer, afterElement.nextSibling);
    };

    observeElement("p.is-avail-response-not-available", (element, domainName) => {

      const normalizedDomain = normalizeDomain(domainName);

      addWhoisButton(element, normalizedDomain);
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
