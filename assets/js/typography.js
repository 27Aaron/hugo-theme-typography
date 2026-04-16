(function () {
  var stage;

  function updateSidebar() {
    var sideBar = document.getElementById('side-bar');
    var mainContainer = document.getElementById('main-container');
    if (!sideBar || !mainContainer) return;

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

  function init() {
    stage = document.getElementById('stage');
    if (!stage) return;

    window.addEventListener('resize', updateSidebar);
    updateSidebar();

    var mainContainer = document.getElementById('main-container');
    var sideBar = document.getElementById('side-bar');
    if (mainContainer) {
      mainContainer.classList.remove('invisible');
      mainContainer.classList.add('fadeInTop');
    }
    if (sideBar) {
      sideBar.classList.remove('invisible');
      if (window.innerWidth <= 768) {
        sideBar.classList.add('fadeInTop');
      } else {
        sideBar.classList.add('fadeInRight');
      }
    }

    var siteTitle = document.querySelector('.site-title');
    if (siteTitle) {
      siteTitle.addEventListener('click', function () {
        var link = siteTitle.querySelector('a');
        if (link) link.click();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
