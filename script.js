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

    orientationButtons.forEach(button => {

        button.addEventListener("click", () => {

            const filter = button.dataset.filter;

            /* Change active button */
            orientationButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");


            /* Show matching videos */
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
