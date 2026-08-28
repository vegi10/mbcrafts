document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       ELEMENTS
    ========================================= */

    const videos =
        document.querySelectorAll(".project-card video");

    const orientationButtons =
        document.querySelectorAll(".orientation-btn");

    const categoryButtons =
        document.querySelectorAll(".category-btn");

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

        if (!currentVideo.matches(".project-card video")) {
            return;
        }

        videos.forEach(function (video) {

            if (video !== currentVideo) {

                video.pause();
                video.currentTime = 0;

            }

        });

    }, true);


    /* =========================================
       VIDEO HOVER PLAY
    ========================================= */

    projectCards.forEach(function (card) {

        const video = card.querySelector("video");

        if (!video) {
            return;
        }


        /* MOUSE ENTER */

        video.addEventListener("mouseenter", function () {

            videos.forEach(function (otherVideo) {

                if (otherVideo !== video) {

                    otherVideo.pause();
                    otherVideo.currentTime = 0;

                }

            });

            video.play().catch(function () {});

        });


        /* MOUSE LEAVE */

        video.addEventListener("mouseleave", function () {

            video.pause();
            video.currentTime = 0;

        });

    });


    /* =========================================
       CURRENT FILTERS

       DEFAULT:
       CATEGORY = ALL
       ORIENTATION = LANDSCAPE
    ========================================= */

    let currentCategory = "all";
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


        /* =====================================
           CHECK EVERY PROJECT
        ===================================== */

        projectCards.forEach(function (card) {

            /* ---------------------------------
               ORIENTATION CHECK
            --------------------------------- */

            const correctOrientation =
                card.classList.contains(currentOrientation);


            /* ---------------------------------
               CATEGORY CHECK
            --------------------------------- */

            const cardCategory =
                card.dataset.category;


            let correctCategory = false;


            /* ALL = LANDSCAPE VIDEOS ONLY */

            if (currentCategory === "all") {

                correctCategory = true;

            }

            /* SPECIFIC CATEGORY */

            else {

                correctCategory =
                    cardCategory === currentCategory;

            }


            /* ---------------------------------
               SEARCH CHECK
            --------------------------------- */

            const text =
                card.innerText.toLowerCase();

            const matchesSearch =
                search === "" ||
                text.includes(search);


            /* ---------------------------------
               FINAL SHOW / HIDE
            --------------------------------- */

            if (
                correctOrientation &&
                correctCategory &&
                matchesSearch
            ) {

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
       ORIENTATION BUTTONS
    ========================================= */

    orientationButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            currentOrientation =
                this.dataset.filter;


            orientationButtons.forEach(function (btn) {

                btn.classList.remove("active");

            });

            this.classList.add("active");


            updateProjects();

        });

    });


    /* =========================================
       CATEGORY BUTTONS
    ========================================= */

    categoryButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            currentCategory =
                this.dataset.category;


            categoryButtons.forEach(function (btn) {

                btn.classList.remove("active");

            });

            this.classList.add("active");


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
       DEFAULT CATEGORY = ALL
    ========================================= */

    const allCategoryButton =
        document.querySelector(
            '[data-category="all"]'
        );


    if (allCategoryButton) {

        categoryButtons.forEach(function (btn) {

            btn.classList.remove("active");

        });

        allCategoryButton.classList.add("active");

        currentCategory = "all";

    }


    /* =========================================
       DEFAULT ORIENTATION = LANDSCAPE
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
