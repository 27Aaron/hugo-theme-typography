(function () {
  var stage;
  var activeFetchController = null;
  var themeStorageKey = 'theme';

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getPreferredTheme() {
    var savedTheme = null;

    try {
      savedTheme = window.localStorage.getItem(themeStorageKey);
    } catch (error) {}

    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    return document.documentElement.dataset.defaultTheme || getSystemTheme();
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeToggle(theme);
  }

  function persistTheme(theme) {
    try {
      window.localStorage.setItem(themeStorageKey, theme);
    } catch (error) {}
  }

  function updateThemeToggle(theme) {
    var toggle = document.querySelector('[data-theme-toggle]');
    if (!toggle) return;

    var label = theme === 'dark' ? '切换到浅色' : '切换到深色';
    var icon = 'fa fa-adjust';

    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('title', label);
    toggle.querySelector('i').className = icon;
  }

  function bindThemeToggle() {
    var toggle = document.querySelector('[data-theme-toggle]');
    if (!toggle || toggle.dataset.bound === 'true') return;

    toggle.addEventListener('click', function () {
      var currentTheme = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
      var nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

      applyTheme(nextTheme);
      persistTheme(nextTheme);
    });

    toggle.dataset.bound = 'true';
  }

  function updateSidebar() {
    var sideBar = document.getElementById('side-bar');
    var mainContainer = document.getElementById('main-container');
    if (!stage || !sideBar || !mainContainer) return;

    if (window.innerWidth <= 768 || window.innerHeight <= 600) {
      sideBar.style.width = stage.offsetWidth + 'px';
      mainContainer.classList.remove('col-sm-9');
    } else {
      var sidebarW =
        stage.offsetWidth - mainContainer.offsetWidth + (window.innerWidth - stage.clientWidth) / 2;
      sideBar.style.width = sidebarW + 'px';
      mainContainer.classList.add('col-sm-9');
    }
  }

  function revealLayout() {
    var mainContainer = document.getElementById('main-container');
    var sideBar = document.getElementById('side-bar');

    if (mainContainer) {
      mainContainer.classList.remove('invisible');
      mainContainer.classList.remove('fadeInTop');
      void mainContainer.offsetWidth;
      mainContainer.classList.add('fadeInTop');
    }

    if (sideBar) {
      sideBar.classList.remove('invisible');
      if (!sideBar.dataset.animated) {
        sideBar.classList.remove('fadeInTop', 'fadeInRight');
        if (window.innerWidth <= 768) {
          sideBar.classList.add('fadeInTop');
        } else {
          sideBar.classList.add('fadeInRight');
        }
        sideBar.dataset.animated = 'true';
      }
    }
  }

  function bindTitleClick() {
    var siteTitle = document.querySelector('.site-title');
    if (!siteTitle || siteTitle.dataset.bound === 'true') return;

    siteTitle.addEventListener('click', function () {
      var link = siteTitle.querySelector('a');
      if (link) link.click();
    });
    siteTitle.dataset.bound = 'true';
  }

  function normalizePathname(pathname) {
    if (!pathname) return '/';
    return pathname.replace(/\/+$/, '') || '/';
  }

  function updateCurrentNav(pathname) {
    var currentPath = normalizePathname(pathname);
    var pageLinks = document.querySelectorAll('.site-nav-pages a');

    pageLinks.forEach(function (link) {
      var linkPath = normalizePathname(new URL(link.href, window.location.origin).pathname);
      var isCurrent = false;

      if (linkPath === '/') {
        isCurrent = currentPath === '/';
      } else if (linkPath === '/post') {
        isCurrent = currentPath === '/post' || currentPath.indexOf('/post/') === 0;
      } else {
        isCurrent = currentPath === linkPath || currentPath.indexOf(linkPath + '/') === 0;
      }

      link.classList.toggle('current', isCurrent);
    });
  }

  function updateHead(doc) {
    if (!doc) return;

    if (doc.title) {
      document.title = doc.title;
    }

    ['description', 'keywords', 'og:description', 'twitter:site', 'twitter:title', 'twitter:card'].forEach(
      function (name) {
        var incoming = doc.head.querySelector('meta[name="' + name + '"]');
        var current = document.head.querySelector('meta[name="' + name + '"]');

        if (incoming && current) {
          current.setAttribute('content', incoming.getAttribute('content') || '');
        } else if (incoming && !current) {
          document.head.appendChild(incoming.cloneNode(true));
        } else if (!incoming && current) {
          current.remove();
        }
      }
    );
  }

  function shouldHandleLink(link, event) {
    if (!link) return false;
    if (event.defaultPrevented) return false;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    if (link.target && link.target !== '_self') return false;
    if (link.hasAttribute('download')) return false;

    var href = link.getAttribute('href');
    if (!href || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0 || href.indexOf('javascript:') === 0) {
      return false;
    }

    var url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    if (url.pathname === window.location.pathname && url.hash) return false;

    return true;
  }

  function swapMainContent(doc, url, pushState) {
    var nextMain = doc.getElementById('main-container');
    var currentMain = document.getElementById('main-container');
    if (!nextMain || !currentMain) {
      window.location.href = url;
      return;
    }

    currentMain.innerHTML = nextMain.innerHTML;
    currentMain.className = nextMain.className;
    currentMain.classList.remove('invisible');

    updateHead(doc);
    updateCurrentNav(new URL(url, window.location.origin).pathname);
    updateSidebar();
    revealLayout();
    bindThemeToggle();
    updateThemeToggle(document.documentElement.getAttribute('data-theme') || getPreferredTheme());
    window.scrollTo({ top: 0, behavior: 'auto' });

    if (pushState) {
      window.history.pushState({ url: url }, '', url);
    }
  }

  function navigate(url, pushState) {
    if (activeFetchController) {
      activeFetchController.abort();
    }

    activeFetchController = new AbortController();

    return window
      .fetch(url, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        signal: activeFetchController.signal,
      })
      .then(function (response) {
        if (!response.ok) throw new Error('Navigation failed');
        return response.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        swapMainContent(doc, url, pushState);
      })
      .catch(function (error) {
        if (error.name === 'AbortError') return;
        window.location.href = url;
      })
      .finally(function () {
        activeFetchController = null;
      });
  }

  function bindNavigation() {
    if (document.body.dataset.navBound === 'true') return;

    document.addEventListener('click', function (event) {
      var link = event.target.closest('a');
      if (!shouldHandleLink(link, event)) return;

      event.preventDefault();
      navigate(link.href, true);
    });

    window.addEventListener('popstate', function () {
      navigate(window.location.href, false);
    });

    document.body.dataset.navBound = 'true';
  }

  function init() {
    stage = document.getElementById('stage');
    if (!stage) return;

    applyTheme(getPreferredTheme());
    window.addEventListener('resize', updateSidebar);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      try {
        if (window.localStorage.getItem(themeStorageKey)) return;
      } catch (error) {}

      applyTheme(getSystemTheme());
    });
    updateSidebar();
    revealLayout();
    bindTitleClick();
    bindNavigation();
    bindThemeToggle();
    updateCurrentNav(window.location.pathname);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
