(() => {
  let lastUrl = location.href; 
  let processedDomain = "";

  const brDomains = [
    'adm.br', 'adv.br', 'agr.br', 'am.br', 'app.br', 'arq.br', 'art.br', 'ato.br', 'b.br', 'bio.br', 'blog.br', 'bmd.br', 
    'caxias.br', 'cim.br', 'cng.br', 'cnt.br', 'com.br', 'coop.br', 'cri.br', 'cuiaba.br', 'curitiba.br', 'def.br', 
    'des.br', 'det.br', 'dev.br', 'ecn.br', 'edu.br', 'emp.br', 'eng.br', 'esp.br', 'etc.br', 'eti.br', 'far.br', 
    'feira.br', 'flog.br', 'floripa.br', 'fm.br', 'fot.br', 'fst.br', 'g12.br', 'geo.br', 'ggf.br', 'goiania.br', 
    'gov.br', 'gru.br', 'imb.br', 'ind.br', 'inf.br', 'jor.br', 'jus.br', 'lel.br', 'log.br', 'mat.br', 'med.br', 
    'mil.br', 'mus.br', 'net.br', 'nom.br', 'not.br', 'ntr.br', 'odo.br', 'ong.br', 'org.br', 'palmas.br', 'poa.br', 
    'ppg.br', 'pro.br', 'psc.br', 'psi.br', 'qsl.br', 'rec.br', 'recife.br', 'rio.br', 'riobranco.br', 'riopreto.br', 
    'salvador.br', 'sampa.br', 'santamaria.br', 'santoandre.br', 'saobernardo.br', 'saogonca.br', 'sjc.br', 'slg.br', 
    'slz.br', 'srv.br', 'taxi.br', 'tec.br', 'tmp.br', 'trd.br', 'tur.br', 'vet.br', 'vix.br', 'vlog.br', 'wiki.br', 
    'zlg.br'
  ];

  const init = () => {
    const observeElement = (selector, callback) => {
      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          const domainName = new URL(window.location.href).searchParams.get("fqdn");
          if (domainName !== processedDomain) {
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
      for (const brDomain of brDomains) {
        if (domain.endsWith(`.${brDomain}`)) {
          return domain;
        }
      }
      if (domain.endsWith(".com")) {
        return `${domain}.br`;
      }
      return `${domain}.com.br`;
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

      const buttonLink = document.createElement("a");
      buttonLink.id = "whois-button";
      buttonLink.textContent = "Consultar proprietário no Whois";
      buttonLink.href = `https://registro.br/tecnologia/ferramentas/whois?search=${encodeURIComponent(domain)}`;
      buttonLink.target = "_blank";
      buttonLink.style.display = "inline-block";
      buttonLink.style.padding = "10px 20px";
      buttonLink.style.backgroundColor = "#56a845";
      buttonLink.style.color = "#fff";
      buttonLink.style.textDecoration = "none";
      buttonLink.style.border = "none";
      buttonLink.style.borderRadius = "5px";
      buttonLink.style.cursor = "pointer";
      buttonLink.style.fontSize = "20px";

      buttonContainer.appendChild(buttonLink);
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
