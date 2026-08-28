<script>
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
    ========================================= */

    document.addEventListener("play", function (event) {

        const currentVideo = event.target;

        /* Ignore anything that is not a project video */
        if (!currentVideo.matches(".project-card video")) {
            return;
        }

        /* Stop every other video */
        videos.forEach(function (video) {

            if (video !== currentVideo) {

                video.pause();
                video.currentTime = 0;

            }

        });

    }, true);


    /* =========================================
       VIDEO HOVER PLAY
       WORKS FOR LANDSCAPE + VERTICAL
    ========================================= */

    projectCards.forEach(function (card) {

        const video = card.querySelector("video");

        if (!video) {
            return;
        }


        /* -----------------------------------------
           MOUSE ENTER VIDEO / MEDIA AREA
        ----------------------------------------- */

        video.addEventListener("mouseenter", function () {

            /* Stop all other videos first */

            videos.forEach(function (otherVideo) {

                if (otherVideo !== video) {

                    otherVideo.pause();
                    otherVideo.currentTime = 0;

                }

            });


            /* Play current video */

            video.play().catch(function () {});

        });


        /* -----------------------------------------
           MOUSE LEAVE VIDEO
        ----------------------------------------- */

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

        /* Get search text */

        const search =
            searchInput
                ? searchInput.value.toLowerCase().trim()
                : "";


        let visibleCount = 0;


        /* Check every project card */

        projectCards.forEach(function (card) {


            /* -------------------------------------
               ORIENTATION CHECK
            ------------------------------------- */

            const correctOrientation =
                card.classList.contains(currentOrientation);


            /* -------------------------------------
               SEARCH CHECK
            ------------------------------------- */

            const text =
                card.innerText.toLowerCase();

            const matchesSearch =
                search === "" ||
                text.includes(search);


            /* -------------------------------------
               SHOW / HIDE
            ------------------------------------- */

            if (correctOrientation && matchesSearch) {

                card.classList.remove("is-hidden");

                visibleCount++;

            }

            else {

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


            /* Get selected orientation */

            currentOrientation =
                this.dataset.filter;


            /* Change active button */

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
</script>
