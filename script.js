document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       VIDEO HOVER PLAY
    ========================================= */

    const videos = document.querySelectorAll(".project-card video");

    videos.forEach(video => {

        video.addEventListener("mouseenter", () => {
            video.play().catch(() => {});
        });

        video.addEventListener("mouseleave", () => {
            video.pause();
            video.currentTime = 0;
        });

    });


    /* =========================================
       LANDSCAPE / VERTICAL FILTER
    ========================================= */

    const orientationButtons =
        document.querySelectorAll(".orientation-btn");

    const projectCards =
        document.querySelectorAll(".project-card");

    const piecesCount =
        document.querySelector(".pieces-count span");


    orientationButtons.forEach(button => {

        button.addEventListener("click", function () {

            const selectedFilter = this.dataset.filter;

            /* -----------------------------
               CHANGE ACTIVE BUTTON
            ----------------------------- */

            orientationButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            this.classList.add("active");


            /* -----------------------------
               SHOW / HIDE PROJECTS
            ----------------------------- */

            let visibleCount = 0;

            projectCards.forEach(card => {

                if (card.classList.contains(selectedFilter)) {

                    card.classList.remove("is-hidden");

                    visibleCount++;

                } else {

                    card.classList.add("is-hidden");

                    /* Stop hidden videos */
                    const video = card.querySelector("video");

                    if (video) {
                        video.pause();
                        video.currentTime = 0;
                    }
                }

            });


            /* -----------------------------
               UPDATE PIECES COUNT
            ----------------------------- */

            if (piecesCount) {
                piecesCount.textContent =
                    visibleCount + " pieces";
            }

        });

    });

});
