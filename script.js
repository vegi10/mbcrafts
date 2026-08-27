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
       CURRENT FILTER
    ========================================= */

    let currentOrientation = "landscape";


    /* =========================================
       FILTER PROJECTS
    ========================================= */

    function filterProjects() {

        const searchText =
            searchInput ? searchInput.value.toLowerCase().trim() : "";

        let visibleCount = 0;


        projectCards.forEach(card => {

            /* Check orientation */
            const matchesOrientation =
                card.classList.contains(currentOrientation);


            /* Get project text */
            const cardText =
                card.textContent.toLowerCase();


            /* Check search */
            const matchesSearch =
                searchText === "" ||
                cardText.includes(searchText);


            /* Show only if BOTH match */
            if (matchesOrientation && matchesSearch) {

                card.classList.remove("is-hidden");

                visibleCount++;

            } else {

                card.classList.add("is-hidden");

                /* Stop hidden video */
                const video = card.querySelector("video");

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
                visibleCount + " pieces";

        }

    }


    /* =========================================
       LANDSCAPE / VERTICAL BUTTONS
    ========================================= */

    orientationButtons.forEach(button => {

        button.addEventListener("click", function () {

            currentOrientation =
                this.dataset.filter;


            /* Change active button */

            orientationButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            this.classList.add("active");


            /* Apply filter */

            filterProjects();

        });

    });


    /* =========================================
       SEARCH
    ========================================= */

    if (searchInput) {

        searchInput.addEventListener("input", () => {

            filterProjects();

        });

    }


    /* =========================================
       DEFAULT VIEW
       LANDSCAPE
    ========================================= */

    const landscapeButton =
        document.querySelector('[data-filter="landscape"]');

    if (landscapeButton) {

        orientationButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        landscapeButton.classList.add("active");

        currentOrientation = "landscape";

    }


    /* =========================================
       INITIAL FILTER
    ========================================= */

    filterProjects();

});
