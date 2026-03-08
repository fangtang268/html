document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const header = document.querySelector('.header');
    
    // 菜单切换
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('small-nav-active');
        document.body.classList.toggle('menu-open'); // 防止背景滚动
    });

    // 点击导航链接时关闭菜单
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            nav.classList.remove('small-nav-active');
            document.body.classList.remove('menu-open');
        });
    });

    // 滚动时改变header样式
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 点击菜单外区域关闭菜单
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('small-nav-active')) {
            menuToggle.classList.remove('active');
            nav.classList.remove('small-nav-active');
            document.body.classList.remove('menu-open');
        }
    });
});
