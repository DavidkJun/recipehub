document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.querySelector('.navbar-toggle');
    const menu = document.getElementById('primary-navigation');

    if (toggle && menu) {
        toggle.addEventListener('click', function() {
            const isOpen = menu.classList.toggle('is-open');
            if (isOpen) {
                menu.classList.remove('is-collapsed');
            } else {
                menu.classList.add('is-collapsed');
            }
            toggle.setAttribute('aria-expanded', String(isOpen));
        });

        // Закривати меню при виборі пункту на мобільному
        menu.querySelectorAll('a.nav-link').forEach(function(link) {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    menu.classList.remove('is-open');
                    menu.classList.add('is-collapsed');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Скидання стану при зміні розміру екрана
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                menu.classList.remove('is-collapsed');
                menu.classList.add('is-open');
                toggle.setAttribute('aria-expanded', 'true');
            } else {
                menu.classList.remove('is-open');
                menu.classList.add('is-collapsed');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Ініціалізація початкового стану
        if (window.innerWidth > 768) {
            menu.classList.add('is-open');
            menu.classList.remove('is-collapsed');
            toggle.setAttribute('aria-expanded', 'true');
        } else {
            menu.classList.add('is-collapsed');
            menu.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
        }
    }
});