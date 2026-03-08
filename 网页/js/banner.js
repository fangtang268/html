class Banner {
    constructor() {
        this.container = document.querySelector('.banner-wrapper');
        this.slides = document.querySelectorAll('.banner-slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.banner-arrow-left');
        this.nextBtn = document.querySelector('.banner-arrow-right');
        
        this.currentIndex = 0;
        this.slideCount = this.slides.length;
        this.timer = null;
        this.autoPlayDelay = 3000;
        this.isAnimating = false;
        this.transitionTime = 500;
        this.slideWidth = 100 / (this.slideCount + 2);
        this.isResetting = false;
        
        this.init();
    }
    
    init() {
        // 克隆首尾幻灯片
        const firstClone = this.slides[0].cloneNode(true);
        const lastClone = this.slides[this.slideCount - 1].cloneNode(true);
        
        this.container.appendChild(firstClone);
        this.container.insertBefore(lastClone, this.slides[0]);
        
        // 初始化位置
        this.container.style.width = `${(this.slideCount + 2) * 100}%`;
        this.setPosition(0, false);
        
        requestAnimationFrame(() => {
            this.container.style.transition = `transform ${this.transitionTime}ms ease-in-out`;
        });
        
        this.bindEvents();
        this.startAutoPlay();
    }
    
    bindEvents() {
        this.prevBtn.addEventListener('click', () => {
            if (this.isAnimating || this.isResetting) {
                this.prevBtn.classList.add('disabled');
                return;
            }
            this.prev();
            this.resetAutoPlay();
        });
        
        this.nextBtn.addEventListener('click', () => {
            if (this.isAnimating || this.isResetting) {
                this.nextBtn.classList.add('disabled');
                return;
            }
            this.next();
            this.resetAutoPlay();
        });
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (this.isAnimating) return;
                this.goTo(index);
                this.resetAutoPlay();
            });
        });
        
        this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());
        
        this.container.addEventListener('transitionstart', () => {
            this.isAnimating = true;
            this.prevBtn.classList.add('disabled');
            this.nextBtn.classList.add('disabled');
        });
        
        this.container.addEventListener('transitionend', () => {
            this.handleTransitionEnd();
            this.prevBtn.classList.remove('disabled');
            this.nextBtn.classList.remove('disabled');
        });
    }
    
    handleTransitionEnd() {
        this.prevBtn.classList.remove('disabled');
        this.nextBtn.classList.remove('disabled');
        
        if (!this.isResetting) {
            this.isAnimating = false;
        }
        this.updateDots();
    }
    
    setPosition(index, useTransition = true) {
        if (!useTransition) {
            this.container.style.transition = 'none';
        }
        
        const position = -(index + 1) * this.slideWidth;
        this.container.style.transform = `translateX(${position}%)`;
        
        if (!useTransition) {
            this.container.offsetHeight;
            requestAnimationFrame(() => {
                this.container.style.transition = `transform ${this.transitionTime}ms ease-in-out`;
            });
        }
    }
    
    updateDots() {
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.normalizeIndex(this.currentIndex));
        });
    }
    
    normalizeIndex(index) {
        if (index >= this.slideCount) return 0;
        if (index < 0) return this.slideCount - 1;
        return index;
    }
    
    goTo(index) {
        if (this.isAnimating || this.isResetting) return;
        this.isAnimating = true;
        this.currentIndex = index;
        this.setPosition(this.currentIndex);
        this.updateDots();
    }
    
    prev() {
        if (this.isAnimating || this.isResetting) return;
        this.isAnimating = true;
        this.currentIndex--;
        this.setPosition(this.currentIndex);
        
        if (this.currentIndex < 0) {
            this.isResetting = true;
            setTimeout(() => {
                this.currentIndex = this.slideCount - 1;
                this.setPosition(this.currentIndex, false);
                this.isResetting = false;
                this.isAnimating = false;
                this.prevBtn.classList.remove('disabled');
                this.nextBtn.classList.remove('disabled');
            }, this.transitionTime);
        }
    }
    
    next() {
        if (this.isAnimating || this.isResetting) return;
        this.isAnimating = true;
        this.currentIndex++;
        this.setPosition(this.currentIndex);
        
        if (this.currentIndex >= this.slideCount) {
            this.isResetting = true;
            setTimeout(() => {
                this.currentIndex = 0;
                this.setPosition(this.currentIndex, false);
                this.isResetting = false;
                this.isAnimating = false;
                this.prevBtn.classList.remove('disabled');
                this.nextBtn.classList.remove('disabled');
            }, this.transitionTime);
        }
    }
    
    startAutoPlay() {
        if (this.timer) return;
        this.timer = setInterval(() => {
            if (!this.isAnimating) this.next();
        }, this.autoPlayDelay);
    }
    
    stopAutoPlay() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Banner();
});
