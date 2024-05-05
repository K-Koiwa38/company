'use strict';

const $body = document.body;
const activeClass = 'is-active';
const mqlTab = window.matchMedia('(min-width:768px)');

// Hamburger
(() => {
    document.addEventListener('DOMContentLoaded', function () {
        const $gNav = document.getElementById('js-globalNav');
        const $spMenuBtn = document.getElementById('js-spMenuBtn');
        const $menuAnc = $gNav.querySelectorAll('a');
        const txt = {
            opened: 'メニューを開く',
            closed: 'メニューを閉じる'
        };
        const menuOpenClass = 'is-spMenuOpen';

        if (!$gNav) {
            return;
        }

       $spMenuBtn.setAttribute('aria-expanded', 'false');
       $spMenuBtn.setAttribute('aria-controls', 'js-globalNav');

        function mediaChange(mqlTab) {
            if (mqlTab.matches) {
               $spMenuBtn.classList.remove(activeClass);
                closeAction();
                $menuAnc.forEach(function (anchor) {
                    anchor.setAttribute('tabindex', '');
                });
            } else {
                $menuAnc.forEach(function (anchor) {
                    anchor.setAttribute('tabindex', -1);
                });

               $spMenuBtn.addEventListener('click', function () {
                   $spMenuBtn.classList.toggle(activeClass);
                   $body.classList.toggle(menuOpenClass);

                    if ($spMenuBtn.getAttribute('aria-expanded') === 'true') {
                        closeAction();
                    } else {
                        $spMenuBtn.setAttribute('aria-expanded', 'true');
                        $spMenuBtn.querySelector('.l-spMenuBtn-txt').textContent = txt.closed;
                        $gNav.setAttribute('aria-expanded', 'true');
                        $gNav.setAttribute('aria-hidden', 'false');
                        $menuAnc.forEach(function (anchor) {
                            anchor.setAttribute('tabindex', 0);
                        });
                    }

                    return false;
                });

                $gNav.addEventListener('click', function () {
                    $spMenuBtn.classList.remove(activeClass);
                    $body.classList.remove(menuOpenClass);
                    closeAction();

                    return false;
                });

                $gNav.addEventListener('click', function (e) {
                    e.stopPropagation();
                });
            }
        }

        mediaChange(mqlTab);
        mqlTab.addEventListener('change', mediaChange);

        window.addEventListener('load', function () {
            closeAction();
            if (mqlTab.matches) {
                $menuAnc.forEach(function (anchor) {
                    anchor.setAttribute('tabindex', '');
                });
            }
        });

        function closeAction() {
           $spMenuBtn.setAttribute('aria-expanded', 'false');
           $spMenuBtn.querySelector('.l-spMenuBtn-txt').textContent = txt.opened;

            $gNav.setAttribute('aria-expanded', 'false');
            $gNav.setAttribute('aria-hidden', 'true');
            $menuAnc.forEach(function (anchor) {
                anchor.setAttribute('tabindex', -1);
            });
        }
    });
})();

// Smooth Scroll
(() => {
    document.querySelectorAll('[href^="#anc-"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();

            let href = e.target.getAttribute('href');

            if(href === "#anc-top") {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }

            return false;
        });
    });
})();

// Link Top
(() => {
    document.addEventListener("DOMContentLoaded", function() {
        const linkTopElement = document.querySelector("#js-linkTop");
        let timeout = null;

        function handleScroll() {
            if (timeout) {
                window.cancelAnimationFrame(timeout);
            }

            timeout = window.requestAnimationFrame(function() {
                if (window.scrollY >= 300) {
                    linkTopElement.classList.add(activeClass);
                } else {
                    linkTopElement.classList.remove(activeClass);
                }
            });
        }

        window.addEventListener('scroll', handleScroll);
        handleScroll();
    });
})();

// Splide
(() => {
    document.addEventListener( 'DOMContentLoaded', function() {
        new Splide('#js-topWorkSplide', {
            type: 'loop',
            arrows: false,
            pagination: false,
            autoScroll: {
                speed: 1,
            }
        }).mount(window.splide.Extensions);
    });
})();
