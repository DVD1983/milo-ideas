export function initCarousel(): void {
  const track = document.getElementById('carouselTrack');
  const slides = track?.children;
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('carouselDots');

  if (!track || !slides || !prevBtn || !nextBtn || !dotsContainer) return;

  let currentIndex = 0;
  let autoSlideInterval: ReturnType<typeof setInterval>;
  let touchStartX = 0;
  let touchEndX = 0;

  Array.from(slides).forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => { goToSlide(i); resetAutoSlide(); });
    dot.className = 'w-3 h-3 rounded-full border-none cursor-pointer transition-all duration-300 bg-gray-300 hover:bg-gray-400';
    if (i === 0) {
      dot.classList.add('bg-black', 'scale-125');
    }
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.children) as HTMLButtonElement[];

  function goToSlide(index: number): void {
    currentIndex = index;
    track!.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((d) => {
      d.classList.remove('bg-black', 'scale-125');
      d.classList.add('bg-gray-300');
    });
    dots[currentIndex]?.classList.remove('bg-gray-300');
    dots[currentIndex]?.classList.add('bg-black', 'scale-125');
  }

  function nextSlide(): void {
    currentIndex = (currentIndex + 1) % slides.length;
    goToSlide(currentIndex);
  }

  function prevSlide(): void {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(currentIndex);
  }

  function startAutoSlide(): void {
    autoSlideInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoSlide(): void {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
  prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });

  const carousel = document.querySelector('.carousel-container');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    carousel.addEventListener('mouseleave', startAutoSlide);
  }

  carousel?.addEventListener('touchstart', (e: TouchEvent) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carousel?.addEventListener('touchend', (e: TouchEvent) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      resetAutoSlide();
    }
  }, { passive: true });

  goToSlide(0);
  startAutoSlide();
}
