document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       VIDEO HOVER PLAY
    ========================= */

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


    /* =========================
       LANDSCAPE / VERTICAL FILTER
    ========================= */

    const orientationButtons =
        document.querySelectorAll(".orientation-btn");

    const projectCards =
        document.querySelectorAll(".project-card");

    const piecesCount =
        document.querySelector(".pieces-count span");


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
               SHOW / HIDE VIDEOS
            ------------------------- */

            let visibleCount = 0;

            projectCards.forEach(card => {

                if (card.classList.contains(filter)) {

                    card.style.display = "";

                    visibleCount++;

                } else {

                    card.style.display = "none";

                }

            });


            /* -------------------------
               UPDATE PIECES COUNT
            ------------------------- */

            if (piecesCount) {
                piecesCount.textContent =
                    visibleCount + " pieces";
            }

        });

    });


    /* =========================
       START WITH LANDSCAPE
    ========================= */

    projectCards.forEach(card => {

        if (card.classList.contains("landscape")) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }

    });


    if (piecesCount) {
        piecesCount.textContent = "7 pieces";
    }

});
