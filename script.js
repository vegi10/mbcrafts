document.addEventListener("DOMContentLoaded", () => {

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
       CURRENT ORIENTATION
    ========================================= */

    let currentOrientation = "landscape";


    /* =========================================
       VIDEO PLAY
       ONLY ONE VIDEO AT A TIME
    ========================================= */

    videos.forEach(function (video) {

        video.addEventListener("play", function () {

            videos.forEach(function (otherVideo) {

                if (otherVideo !== video) {
                    otherVideo.pause();
                }

            });

        });


        /* -----------------------------
           HOVER PLAY
        ----------------------------- */

        video.addEventListener("mouseenter", function () {

            video.play().catch(function () {});

        });


        /* -----------------------------
           HOVER LEAVE
        ----------------------------- */

        video.addEventListener("mouseleave", function () {

            video.pause();
            video.currentTime = 0;

        });

    });


    /* =========================================
       MAIN FILTER FUNCTION
    ========================================= */

    function updateProjects() {

        /* Get search text */

        const search =
            searchInput
                ? searchInput.value.toLowerCase().trim()
                : "";


        let count = 0;


        projectCards.forEach(function (card) {

            /* -----------------------------
               ORIENTATION CHECK
            ----------------------------- */

            const correctOrientation =
                card.classList.contains(currentOrientation);


            /* -----------------------------
               SEARCH CHECK
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

                count++;

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
           UPDATE PIECES COUNT
        ===================================== */

        if (piecesCount) {

            piecesCount.textContent =
                count +
                (count === 1 ? " piece" : " pieces");

        }

    }


    /* =========================================
       LANDSCAPE / VERTICAL BUTTONS
    ========================================= */

    orientationButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            /* Get selected orientation */

            currentOrientation =
                button.dataset.filter;


            /* -----------------------------
               ACTIVE BUTTON
            ----------------------------- */

            orientationButtons.forEach(function (btn) {

                btn.classList.remove("active");

            });

            button.classList.add("active");


            /* -----------------------------
               UPDATE PROJECTS
            ----------------------------- */

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
