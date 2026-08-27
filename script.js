document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       VIDEO PLAY / PAUSE
    ========================= */

    const videos = document.querySelectorAll(".project-card video");

    videos.forEach(video => {

        const media = video.closest(".project-media");

        // Create play button
        const playButton = document.createElement("button");
        playButton.classList.add("video-play-button");
        playButton.innerHTML = "▶";
        playButton.setAttribute("aria-label", "Play video");

        media.appendChild(playButton);


        /* =========================
           CLICK PLAY / PAUSE
        ========================= */

        playButton.addEventListener("click", (event) => {

            event.stopPropagation();

            if (video.paused) {

                // Pause all other videos
                videos.forEach(otherVideo => {
                    if (otherVideo !== video) {
                        otherVideo.pause();

                        const otherButton =
                            otherVideo.closest(".project-media")
                            .querySelector(".video-play-button");

                        if (otherButton) {
                            otherButton.innerHTML = "▶";
                            otherButton.classList.remove("playing");
                        }
                    }
                });

                video.play();

                playButton.innerHTML = "Ⅱ";
                playButton.classList.add("playing");

            } else {

                video.pause();

                playButton.innerHTML = "▶";
                playButton.classList.remove("playing");

            }

        });


        /* =========================
           CLICK VIDEO ITSELF
        ========================= */

        video.addEventListener("click", () => {

            if (video.paused) {
                video.play();
                playButton.innerHTML = "Ⅱ";
                playButton.classList.add("playing");
            } else {
                video.pause();
                playButton.innerHTML = "▶";
                playButton.classList.remove("playing");
            }

        });


        /* =========================
           VIDEO FINISHED
        ========================= */

        video.addEventListener("ended", () => {

            video.currentTime = 0;

            playButton.innerHTML = "▶";
            playButton.classList.remove("playing");

        });

    });


    /* =========================
       LANDSCAPE / VERTICAL FILTER
    ========================= */

    const orientationButtons =
        document.querySelectorAll(".orientation-btn");

    const projectCards =
        document.querySelectorAll(".project-card");

    orientationButtons.forEach(button => {

        button.addEventListener("click", () => {

            const filter = button.dataset.filter;

            orientationButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            projectCards.forEach(card => {

                if (card.classList.contains(filter)) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }

            });

        });

    });

});
