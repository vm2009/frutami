document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('animeVideo');
    const playPauseBtn = document.getElementById('playPause');
    const muteBtn = document.getElementById('mute');
    const fullscreenBtn = document.getElementById('fullscreen');
    const progressBar = document.getElementById('progressBar');
    const qualityButtons = document.querySelectorAll('.quality-btn');
    const prevEpisodeBtn = document.getElementById('prev-episode');
    const nextEpisodeBtn = document.getElementById('next-episode');
    const episodeButtons = document.querySelectorAll('.episode-btn');
  
    let currentEpisode = 1;
    let currentQuality = '720p'; // Початкова якість
  
    // Об'єкт з шляхами до відео
    const videoSources = {
      1: {
        '480p': 'videos/1.480.mp4',
        '720p': 'videos/1.720.mp4',
        '1080p': 'videos/1.1080.mp4'
      },
      2: {
        '480p': 'videos/2.480.mp4',
        '720p': 'videos/2.720.mp4',
        '1080p': 'videos/2.1080.mp4'
      },
      3: {
        '480p': 'videos/3.480.mp4',
        '720p': 'videos/3.720.mp4',
        '1080p': 'videos/3.1080.mp4'
      }
      // Додайте більше епізодів за потребою
    };
  
    // Функція для завантаження епізоду з вибраною якістю
    function loadEpisode(episodeNumber) {
      const sources = videoSources[episodeNumber];
      if (sources && sources[currentQuality]) {
        video.src = sources[currentQuality];
        video.load();
        video.play();
        updatePlayPauseIcon();
      } else {
        console.error(`Відсутній відеофайл для серії ${episodeNumber} з якістю ${currentQuality}`);
      }
    }
  
    // Обробник кнопки Play/Pause
    playPauseBtn.addEventListener('click', function () {
      if (video.paused || video.ended) {
        video.play();
      } else {
        video.pause();
      }
      updatePlayPauseIcon();
    });
  
    // Функція для оновлення іконки Play/Pause
    function updatePlayPauseIcon() {
      if (video.paused || video.ended) {
        playPauseBtn.textContent = '▶️';
      } else {
        playPauseBtn.textContent = '⏸️';
      }
    }
  
    // Обробник кнопки Mute/Unmute
    muteBtn.addEventListener('click', function () {
      video.muted = !video.muted;
      updateMuteIcon();
    });
  
    // Функція для оновлення іконки Mute/Unmute
    function updateMuteIcon() {
      if (video.muted) {
        muteBtn.textContent = '🔇';
      } else {
        muteBtn.textContent = '🔊';
      }
    }
  
    // Обробник кнопки Fullscreen
    fullscreenBtn.addEventListener('click', function () {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.mozRequestFullScreen) { /* Firefox */
        video.mozRequestFullScreen();
      } else if (video.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) { /* IE/Edge */
        video.msRequestFullscreen();
      }
    });
  
    // Обновлення прогрес-бара під час відтворення
    video.addEventListener('timeupdate', function () {
      const progress = (video.currentTime / video.duration) * 100;
      progressBar.value = progress;
    });
  
    // Перемикання часу при зміні прогрес-бара
    progressBar.addEventListener('input', function () {
      const time = (progressBar.value / 100) * video.duration;
      video.currentTime = time;
    });
  
    // Обробник кнопки попереднього епізоду
    prevEpisodeBtn.addEventListener('click', function () {
      if (currentEpisode > 1) {
        currentEpisode--;
        loadEpisode(currentEpisode);
        resetQualityButtons();
      }
    });
  
    // Обробник кнопки наступного епізоду
    nextEpisodeBtn.addEventListener('click', function () {
      const totalEpisodes = Object.keys(videoSources).length;
      if (currentEpisode < totalEpisodes) {
        currentEpisode++;
        loadEpisode(currentEpisode);
        resetQualityButtons();
      }
    });
  
    // Обробники кнопок списку епізодів
    episodeButtons.forEach(button => {
      button.addEventListener('click', function () {
        const episode = parseInt(this.getAttribute('data-episode'));
        if (episode && videoSources[episode]) {
          currentEpisode = episode;
          loadEpisode(currentEpisode);
          resetQualityButtons();
        }
      });
    });
  
    // Обробники кнопок вибору якості відео
    qualityButtons.forEach(button => {
      button.addEventListener('click', function () {
        // Видалити клас 'active' з усіх кнопок
        qualityButtons.forEach(btn => btn.classList.remove('active'));
        // Додати клас 'active' до натиснутої кнопки
        this.classList.add('active');
        // Встановити поточну якість
        currentQuality = this.getAttribute('data-quality');
        // Перезавантажити відео з новою якістю
        loadEpisode(currentEpisode);
      });
    });
  
    // Функція для скидання активного стану кнопок якості при зміні епізоду
    function resetQualityButtons() {
      qualityButtons.forEach(btn => {
        if (btn.getAttribute('data-quality') === currentQuality) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
  
    // Завантажити перший епізод за замовчуванням
    loadEpisode(currentEpisode);
    updateMuteIcon();
  });