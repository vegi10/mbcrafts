document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       VIDEO HOVER PLAY
    ===================================================== */

    const videos = document.querySelectorAll(".project-card video");

    videos.forEach(video => {

        video.addEventListener("mouseenter", () => {

            video.play().catch(error => {
                console.log("Video could not play:", error);
            });

        });

        video.addEventListener("mouseleave", () => {

            video.pause();
            video.currentTime = 0;

        });

    });


    /* =====================================================
       LANDSCAPE / VERTICAL FILTER
    ===================================================== */

    const orientationButtons =
        document.querySelectorAll(".orientation-btn");

    const projectCards =
        document.querySelectorAll(".portfolio-grid .project-card");


    orientationButtons.forEach(button => {

        button.addEventListener("click", () => {

            const filter = button.dataset.filter;


            /* -------------------------
               CHANGE ACTIVE BUTTON
            ------------------------- */

            orientationButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");


            /* -------------------------
               FILTER VIDEOS
            ------------------------- */

            projectCards.forEach(card => {

                if (card.classList.contains(filter)) {

                    card.classList.remove("hidden");

                } else {

                    card.classList.add("hidden");

                }

            });


            /* -------------------------
               UPDATE PIECES COUNT
            ------------------------- */

            const visibleCards =
                document.querySelectorAll(
                    ".portfolio-grid .project-card:not(.hidden)"
                );

            const piecesCount =
                document.querySelector(".pieces-count span");

            if (piecesCount) {

                piecesCount.textContent =
                    visibleCards.length + " pieces";

            }

        });

    });


    /* =====================================================
       INITIAL STATE
       LANDSCAPE = 7
    ===================================================== */

    projectCards.forEach(card => {

        if (card.classList.contains("landscape")) {
            card.classList.remove("hidden");
        } else {
            card.classList.add("hidden");
        }

    });

});
