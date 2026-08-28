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
       CURRENT FILTERS
    ========================================= */

    /*
       DEFAULT:

       Category = ALL
       Orientation = LANDSCAPE

       Therefore:

       ALL + LANDSCAPE
       = ALL LANDSCAPE VIDEOS ONLY
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


            /* =====================================
               CATEGORY CHECK
            ===================================== */

            const cardCategory =
                card.dataset.category;


            let matchesCategory = false;


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
       DEFAULT CATEGORY
       = ALL
    ========================================= */

    categoryButtons.forEach(function (btn) {

        btn.classList.remove("active");

    });


    const allCategoryButton =
        document.querySelector(
            '.category-btn[data-category="all"]'
        );


    if (allCategoryButton) {

        allCategoryButton.classList.add("active");

    }


    currentCategory = "all";


    /* =========================================
       DEFAULT ORIENTATION
       = LANDSCAPE
    ========================================= */

    orientationButtons.forEach(function (btn) {

        btn.classList.remove("active");

    });


    const landscapeButton =
        document.querySelector(
            '.orientation-btn[data-filter="landscape"]'
        );


    if (landscapeButton) {

        landscapeButton.classList.add("active");

    }


    currentOrientation = "landscape";


    /* =========================================
       CUSTOM VIDEO CONTROLS
    ========================================= */

    const projectMedia =
        document.querySelectorAll(".project-media");


    projectMedia.forEach(function (media) {

        const video =
            media.querySelector("video");

        const button =
            media.querySelector(".video-play-button");


        if (!video || !button) {
            return;
        }


        /* =====================================
           CREATE TIMELINE
        ===================================== */

        const timeline =
            document.createElement("div");

        timeline.className =
            "video-timeline";


        const progress =
            document.createElement("div");

        progress.className =
            "video-progress";


        timeline.appendChild(progress);

        media.appendChild(timeline);


        /* =====================================
           BUTTON CLICK
        ===================================== */

        button.addEventListener("click", function (event) {

            event.stopPropagation();


            if (video.paused) {

                video.play().catch(function () {});

            }

            else {

                video.pause();

            }

        });


        /* =====================================
           CLICK ANYWHERE ON VIDEO
        ===================================== */

        video.addEventListener("click", function () {

            if (video.paused) {

                video.play().catch(function () {});

            }

            else {

                video.pause();

            }

        });


        /* =====================================
           PLAY STATE
        ===================================== */

        video.addEventListener("play", function () {

            button.textContent = "Ⅱ";

            button.classList.add("playing");

            button.setAttribute(
                "aria-label",
                "Pause video"
            );

        });


        /* =====================================
           PAUSE STATE
        ===================================== */

        video.addEventListener("pause", function () {

            button.textContent = "▶";

            button.classList.remove("playing");

            button.setAttribute(
                "aria-label",
                "Play video"
            );

        });


        /* =====================================
           VIDEO ENDED
        ===================================== */

        video.addEventListener("ended", function () {

            progress.style.width = "100%";

        });


        /* =====================================
           UPDATE TIMELINE
        ===================================== */

        video.addEventListener("timeupdate", function () {

            if (!video.duration || !isFinite(video.duration)) {
                return;
            }


            const percentage =
                (video.currentTime / video.duration) * 100;


            progress.style.width =
                percentage + "%";

        });


        /* =====================================
           VIDEO METADATA LOADED
        ===================================== */

        video.addEventListener("loadedmetadata", function () {

            progress.style.width = "0%";

        });


        /* =====================================
           CLICK TIMELINE TO SEEK
        ===================================== */

        timeline.addEventListener("click", function (event) {

            event.stopPropagation();


            if (!video.duration || !isFinite(video.duration)) {
                return;
            }


            const rect =
                timeline.getBoundingClientRect();


            const clickPosition =
                event.clientX - rect.left;


            let percentage =
                clickPosition / rect.width;


            /* Keep value between 0 and 1 */

            percentage =
                Math.max(
                    0,
                    Math.min(1, percentage)
                );


            video.currentTime =
                percentage * video.duration;

        });


        /* =====================================
           HOVER PLAY
        ===================================== */

        media.addEventListener("mouseenter", function () {

            video.play().catch(function () {});

        });


        /* =====================================
           HOVER PAUSE
        ===================================== */

        media.addEventListener("mouseleave", function () {

            video.pause();

        });

    });


    /* =========================================
       INITIAL DISPLAY
    ========================================= */

    updateProjects();


    /* =========================================
       REVEAL ANIMATION
    ========================================= */

    const revealElements =
        document.querySelectorAll(".project-card");


    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                    }

                });

            },
            {
                threshold: 0.08
            }
        );


    revealElements.forEach(function (element) {

        observer.observe(element);

    });

});
