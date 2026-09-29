// Style switcher: each click on the avatar button moves to the next style,
// swapping the avatar and the page scenery together.
(function () {
  var THEMES = [
    { id: 'default', name: 'Classic',          avatar: 'default.jpg' },
    { id: 'potter',  name: 'Hogwarts',         avatar: 'potter.jpg' },
    { id: 'pirate',  name: 'Caribbean',        avatar: 'pirate.jpg' },
    { id: 'hiphop',  name: 'Hip-Hop',          avatar: 'hiphop.jpg' },
    { id: 'voyage',  name: 'Age of Discovery', avatar: 'voyage.jpg' },
    { id: 'cowboy',  name: 'Wild West',        avatar: 'cowboy.jpg' }
  ];
  var AVATAR_DIR = './assets/img/avatar/';
  var STORAGE_KEY = 'gz-theme';

  var root = document.documentElement;
  var avatar = document.getElementById('avatar');
  var button = document.getElementById('style-toggle');
  var tip = document.getElementById('style-tip');
  var label = document.getElementById('style-name');
  var curtain = document.querySelector('.curtain');

  function indexOf(id) {
    for (var i = 0; i < THEMES.length; i++) if (THEMES[i].id === id) return i;
    return 0;
  }

  var current = indexOf(root.getAttribute('data-theme'));

  function render(i) {
    var t = THEMES[i];
    var next = THEMES[(i + 1) % THEMES.length];
    root.setAttribute('data-theme', t.id);
    avatar.src = AVATAR_DIR + t.avatar;
    label.textContent = t.name;
    tip.textContent = 'Switch style → ' + next.name;
    button.setAttribute('aria-label', 'Switch style (current: ' + t.name + ', next: ' + next.name + ')');
  }

  function replay(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth; // restart the CSS animation
    el.classList.add(cls);
  }

  // Preload every avatar so the swap is instant.
  THEMES.forEach(function (t) { new Image().src = AVATAR_DIR + t.avatar; });

  render(current);

  button.addEventListener('click', function () {
    current = (current + 1) % THEMES.length;
    replay(avatar, 'flip');
    replay(curtain, 'play');
    // swap mid-flip, when the avatar is edge-on
    setTimeout(function () { render(current); }, 280);
    button.classList.add('seen');
    try { localStorage.setItem(STORAGE_KEY, THEMES[current].id); } catch (e) {}
  });

  // Centre the colour wash on the button.
  function placeCurtain() {
    var r = button.getBoundingClientRect();
    curtain.style.setProperty('--cx', (r.left + r.width / 2) + 'px');
    curtain.style.setProperty('--cy', (r.top + r.height / 2) + 'px');
  }
  button.addEventListener('pointerdown', placeCurtain);
  button.addEventListener('keydown', placeCurtain);

  try { if (localStorage.getItem(STORAGE_KEY)) button.classList.add('seen'); } catch (e) {}
})();
