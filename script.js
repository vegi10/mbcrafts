document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       ELEMENTS
    ========================================= */

    const videos =
        document.querySelectorAll(".project-card video");

    const orientationButtons =
        document.querySelectorAll(".orientation-btn");

    const projectCards =
        document.querySelectorAll(".project-card");

    const piecesCount =
        document.querySelector(".pieces-count span");

    const searchInput =
        document.querySelector(".search-box input");


    /* =========================================
       ONE VIDEO AT A TIME
       This catches ANY video that starts playing
    ========================================= */

    document.addEventListener("play", function (event) {

        const currentVideo = event.target;

        if (!currentVideo.matches(".project-card video")) {
            return;
        }

        videos.forEach(function (video) {

            if (video !== currentVideo) {

                video.pause();

            }

        });

    }, true);


    /* =========================================
       VIDEO HOVER PLAY
    ========================================= */

    videos.forEach(function (video) {

        video.addEventListener("mouseenter", function () {

            video.play().catch(function () {});

        });


        video.addEventListener("mouseleave", function () {

            video.pause();
            video.currentTime = 0;

        });

    });


    /* =========================================
       CURRENT ORIENTATION
    ========================================= */

    let currentOrientation = "landscape";


    /* =========================================
       MAIN FILTER FUNCTION
    ========================================= */

    function updateProjects() {

        const search =
            searchInput
                ? searchInput.value.toLowerCase().trim()
                : "";

        let visibleCount = 0;


        projectCards.forEach(function (card) {

            /* -----------------------------
               ORIENTATION
            ----------------------------- */

            const correctOrientation =
                card.classList.contains(currentOrientation);


            /* -----------------------------
               SEARCH
            ----------------------------- */

            const text =
                card.innerText.toLowerCase();

            const matchesSearch =
                search === "" || text.includes(search);


            /* -----------------------------
               SHOW / HIDE
            ----------------------------- */

            if (correctOrientation && matchesSearch) {

                card.classList.remove("is-hidden");

                visibleCount++;

            } else {

                card.classList.add("is-hidden");


                /* Stop hidden video */

                const video =
                    card.querySelector("video");

                if (video) {

                    video.pause();
                    video.currentTime = 0;

                }

            }

        });


        /* =====================================
           PIECES COUNT
        ===================================== */

        if (piecesCount) {

            piecesCount.textContent =
                visibleCount +
                (visibleCount === 1
                    ? " piece"
                    : " pieces");

        }

    }


    /* =========================================
       LANDSCAPE / VERTICAL BUTTONS
    ========================================= */

    orientationButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            currentOrientation =
                this.dataset.filter;


            /* Active button */

            orientationButtons.forEach(function (btn) {

                btn.classList.remove("active");

            });

            this.classList.add("active");


            /* Update projects */

            updateProjects();

        });

    });


    /* =========================================
       LIVE SEARCH
    ========================================= */

    if (searchInput) {

        searchInput.addEventListener("input", function () {

            updateProjects();

        });

    }


    /* =========================================
       DEFAULT = LANDSCAPE
    ========================================= */

    const landscapeButton =
        document.querySelector(
            '[data-filter="landscape"]'
        );


    if (landscapeButton) {

        orientationButtons.forEach(function (btn) {

            btn.classList.remove("active");

        });

        landscapeButton.classList.add("active");

        currentOrientation = "landscape";

    }


    /* =========================================
       INITIAL DISPLAY
    ========================================= */

    updateProjects();

});
