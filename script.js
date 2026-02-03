// Audio Player Functionality
document.addEventListener('DOMContentLoaded', function() {
    const audioPlayers = document.querySelectorAll('.audio-player');

    audioPlayers.forEach(player => {
        const playBtn = player.querySelector('.play-btn');
        const playIcon = player.querySelector('.play-icon');
        const pauseIcon = player.querySelector('.pause-icon');
        const audio = player.querySelector('audio');
        const progressBar = player.querySelector('.progress-bar');
        const progressFill = player.querySelector('.progress-fill');
        const currentTimeDisplay = player.querySelector('.current-time');
        const totalTimeDisplay = player.querySelector('.total-time');

        // iOS Fix: Load audio metadata immediately
        audio.load();

        // Play/Pause functionality
        playBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent any default behavior
            const audioId = this.getAttribute('data-audio');

            // Pause all other audio players
            document.querySelectorAll('audio').forEach(otherAudio => {
                if (otherAudio.getAttribute('data-id') !== audioId && !otherAudio.paused) {
                    otherAudio.pause();
                    const otherPlayer = otherAudio.closest('.audio-player');
                    otherPlayer.querySelector('.play-icon').classList.remove('hidden');
                    otherPlayer.querySelector('.pause-icon').classList.add('hidden');
                }
            });

            // Toggle current audio
            if (audio.paused) {
                // iOS requires promise handling for play()
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        playIcon.classList.add('hidden');
                        pauseIcon.classList.remove('hidden');
                    }).catch(error => {
                        console.log('Playback failed:', error);
                        // Keep showing play button if playback fails
                    });
                }
            } else {
                audio.pause();
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
            }
        });

        // Update progress bar and time
        audio.addEventListener('timeupdate', function() {
            if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
                const progress = (audio.currentTime / audio.duration) * 100;
                progressFill.style.width = progress + '%';
                currentTimeDisplay.textContent = formatTime(audio.currentTime);
            }
        });

        // Set total time when metadata loads
        audio.addEventListener('loadedmetadata', function() {
            if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
                totalTimeDisplay.textContent = formatTime(audio.duration);
            }
        });

        // iOS fallback: Try to get duration from canplaythrough event
        audio.addEventListener('canplaythrough', function() {
            if (totalTimeDisplay.textContent === '0:00' || totalTimeDisplay.textContent.includes('NaN')) {
                if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
                    totalTimeDisplay.textContent = formatTime(audio.duration);
                }
            }
        });

        // Error handling
        audio.addEventListener('error', function(e) {
            console.log('Audio error:', e);
            totalTimeDisplay.textContent = 'Error';
        });

        // Reset when audio ends
        audio.addEventListener('ended', function() {
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
            progressFill.style.width = '0%';
            currentTimeDisplay.textContent = '0:00';
        });

        // Click on progress bar to seek
        progressBar.addEventListener('click', function(e) {
            if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
                const rect = progressBar.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                const percentage = clickX / width;
                audio.currentTime = percentage * audio.duration;
            }
        });
    });

    // Format time helper function
    function formatTime(seconds) {
        if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Web3Forms submission handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitButton = contactForm.querySelector('.submit-button');
            const formData = new FormData(contactForm);
            formData.append("access_key", "1a7348d4-2a2e-4185-9543-707fec22cd6f");

            // Show loading state
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    // Redirect to thank you page
                    window.location.href = 'thank-you.html';
                } else {
                    // Show error message
                    alert('Sorry, there was an error sending your message. Please try emailing me directly at vaughandouglas@gmail.com');
                    submitButton.textContent = 'Send Message';
                    submitButton.disabled = false;
                }
            } catch (error) {
                console.error('Form submission error:', error);
                alert('Sorry, there was an error sending your message. Please try emailing me directly at vaughandouglas@gmail.com');
                submitButton.textContent = 'Send Message';
                submitButton.disabled = false;
            }
        });
    }

    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for scroll animations
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});
