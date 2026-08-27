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


    function filterVideos(filter) {

        let count = 0;

        projectCards.forEach(card => {

            if (card.classList.contains(filter)) {

                card.style.display = "";

                count++;

            } else {

                card.style.display = "none";

                const video = card.querySelector("video");

                if (video) {
                    video.pause();
                    video.currentTime = 0;
                }

            }

        });


        /* Update count */

        if (piecesCount) {
            piecesCount.textContent = count + " pieces";
        }

    }


    /* =========================
       BUTTON CLICK
    ========================= */

    orientationButtons.forEach(button => {

        button.addEventListener("click", () => {

            const filter = button.getAttribute("data-filter");

            /* Active button */

            orientationButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            /* Filter */

            filterVideos(filter);

        });

    });


    /* =========================
       DEFAULT
       LANDSCAPE
    ========================= */

    filterVideos("landscape");

});
