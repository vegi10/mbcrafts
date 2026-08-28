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
        document.querySelector("#piecesCount");

    const searchInput =
        document.querySelector("#searchInput");


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


        video.addEventListener("mouseenter", function () {

            videos.forEach(function (otherVideo) {

                if (otherVideo !== video) {

                    otherVideo.pause();
                    otherVideo.currentTime = 0;

                }

            });

            video.play().catch(function () {});

        });


        video.addEventListener("mouseleave", function () {

            video.pause();
            video.currentTime = 0;

        });

    });


    /* =========================================
       CURRENT FILTERS
    ========================================= */

    /*
       DEFAULT:
       Category = ALL
       Orientation = LANDSCAPE

       IMPORTANT:
       "ALL" category does NOT mean
       all videos.

       It means all LANDSCAPE videos.
    */

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


        projectCards.forEach(function (card) {

            /* =====================================
               ORIENTATION CHECK
            ===================================== */

            const isLandscape =
                card.classList.contains("landscape");

            const isVertical =
                card.classList.contains("vertical");


            let matchesOrientation = false;


            if (currentOrientation === "landscape") {

                matchesOrientation = isLandscape;

            }

            else if (currentOrientation === "vertical") {

                matchesOrientation = isVertical;

            }

            else {

                matchesOrientation = true;

            }


            /* =====================================
               CATEGORY CHECK
            ===================================== */

            const cardCategory =
                card.dataset.category;


            let matchesCategory = false;


            /*
               CATEGORY = ALL

               Show only LANDSCAPE videos.
            */

            if (currentCategory === "all") {

                matchesCategory = true;

            }

            else {

                matchesCategory =
                    cardCategory === currentCategory;

            }


            /* =====================================
               SEARCH CHECK
            ===================================== */

            const text =
                (
                    card.innerText +
                    " " +
                    (card.dataset.title || "")
                ).toLowerCase();


            const matchesSearch =
                search === "" ||
                text.includes(search);


            /* =====================================
               FINAL RESULT
            ===================================== */

            if (
                matchesOrientation &&
                matchesCategory &&
                matchesSearch
            ) {

                card.classList.remove("is-hidden");

                visibleCount++;

            }

            else {

                card.classList.add("is-hidden");


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
                (
                    visibleCount === 1
                        ? " piece"
                        : " pieces"
                );

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
            '.category-btn[data-category="all"]'
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
            '.orientation-btn[data-filter="landscape"]'
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
