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


    /* =========================
       FILTER FUNCTION
    ========================= */

    function filterVideos(filter) {

        let visibleCount = 0;

        projectCards.forEach(card => {

            if (card.classList.contains(filter)) {

                card.style.display = "";

                visibleCount++;

            } else {

                card.style.display = "none";

                // Stop video if it is hidden
                const video = card.querySelector("video");

                if (video) {
                    video.pause();
                    video.currentTime = 0;
                }

            }

        });


        /* Update pieces count */

        if (piecesCount) {
            piecesCount.textContent = visibleCount + " pieces";
        }

    }


    /* =========================
       ORIENTATION BUTTON CLICK
    ========================= */

    orientationButtons.forEach(button => {

        button.addEventListener("click", () => {

            const filter = button.dataset.filter;


            /* Change active button */

            orientationButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");


            /* Filter videos */

            filterVideos(filter);

        });

    });


    /* =========================
       DEFAULT
       LANDSCAPE
    ========================= */

    filterVideos("landscape");

});
