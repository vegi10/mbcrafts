document.addEventListener("DOMContentLoaded", () => {

    const videos =
        document.querySelectorAll(".project-card video");

    videos.forEach(function (video) {

        video.addEventListener("play", function () {

            videos.forEach(function (otherVideo) {

                if (otherVideo !== video) {
                    otherVideo.pause();
                }

            });

        });

        video.addEventListener("mouseenter", function () {

            video.play().catch(function () {});

        });

        video.addEventListener("mouseleave", function () {

            video.pause();
            video.currentTime = 0;

        });

    });

});


    /* =========================================
       ELEMENTS
    ========================================= */

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
       MAIN FILTER FUNCTION
    ========================================= */

    function updateProjects() {

        /* Get what user typed */
        const search =
            searchInput.value.toLowerCase().trim();


        let count = 0;


        projectCards.forEach(card => {

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

                const video =
                    card.querySelector("video");

                if (video) {
                    video.pause();
                    video.currentTime = 0;
                }

            }

        });


        /* -----------------------------
           PIECES COUNT
        ----------------------------- */

        if (piecesCount) {

            piecesCount.textContent =
                count + (count === 1 ? " piece" : " pieces");

        }

    }


    /* =========================================
       LANDSCAPE / VERTICAL
    ========================================= */

    orientationButtons.forEach(button => {

        button.addEventListener("click", () => {

            currentOrientation =
                button.dataset.filter;


            /* Active button */

            orientationButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");


            /* Update videos */

            updateProjects();

        });

    });


    /* =========================================
       LIVE SEARCH
    ========================================= */

    if (searchInput) {

        searchInput.addEventListener("input", () => {

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

        orientationButtons.forEach(btn => {
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
