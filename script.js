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
       VIDEO VIEWER ELEMENTS
    ========================================= */

    const videoViewer =
        document.getElementById("videoViewer");

    const viewerVideo =
        document.getElementById("viewerVideo");

    const videoViewerClose =
        document.getElementById("videoViewerClose");


    /* =========================================
       CURRENT FILTERS
    ========================================= */

    let currentCategory = "all";
    let currentOrientation = "landscape";


    /* =========================================
       ONE CARD VIDEO AT A TIME
    ========================================= */

    document.addEventListener(
        "play",
        function (event) {

            const currentVideo = event.target;

            if (
                !currentVideo.matches(
                    ".project-card video"
                )
            ) {
                return;
            }


            videos.forEach(function (video) {

                if (video !== currentVideo) {

                    video.pause();
                    video.currentTime = 0;

                }

            });

        },
        true
    );


    /* =========================================
       OPEN VIDEO VIEWER
    ========================================= */

    function openVideoViewer(video) {

        if (
            !videoViewer ||
            !viewerVideo ||
            !video
        ) {
            return;
        }


        const source =
            video.querySelector("source");


        if (!source) {

            console.log(
                "No source found for this video."
            );

            return;
        }


        /* =====================================
           GET VIDEO URL
        ===================================== */

        const videoURL =
            source.src ||
            source.getAttribute("src");


        if (!videoURL) {

            console.log(
                "Video source is empty."
            );

            return;
        }


        /* =====================================
           STOP ALL CARD VIDEOS
        ===================================== */

        document
            .querySelectorAll(
                ".project-card video"
            )
            .forEach(function (otherVideo) {

                otherVideo.pause();

            });


        /* =====================================
           SET VIEWER VIDEO
        ===================================== */

        viewerVideo.pause();

        viewerVideo.removeAttribute("src");

        viewerVideo.load();


        viewerVideo.src = videoURL;


        /* =====================================
           SET POSTER
        ===================================== */

        const poster =
            video.getAttribute("poster");


        if (poster) {

            viewerVideo.poster = poster;

        }


        /* =====================================
           OPEN VIEWER
        ===================================== */

        videoViewer.classList.add("active");

        document.body.style.overflow = "hidden";


        /* =====================================
           LOAD VIDEO
        ===================================== */

        viewerVideo.load();


        /* =====================================
           PLAY AFTER VIDEO IS READY
        ===================================== */

        viewerVideo.onloadedmetadata =
            function () {

                viewerVideo.currentTime = 0;

                viewerVideo.play().catch(
                    function () {
                        console.log(
                            "Autoplay was blocked."
                        );
                    }
                );

            };

    }


    /* =========================================
       CLOSE VIDEO VIEWER
    ========================================= */

    function closeVideoViewer() {

        if (
            !videoViewer ||
            !viewerVideo
        ) {
            return;
        }


        /* Stop viewer video */

        viewerVideo.pause();


        /* Remove video */

        viewerVideo.removeAttribute("src");

        viewerVideo.removeAttribute("poster");

        viewerVideo.load();


        /* Close viewer */

        videoViewer.classList.remove("active");


        /* Restore scrolling */

        document.body.style.overflow = "";

    }


    /* =========================================
       CLOSE BUTTON
    ========================================= */

    if (videoViewerClose) {

        videoViewerClose.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                closeVideoViewer();

            }
        );

    }


    /* =========================================
       CLICK OUTSIDE VIDEO
    ========================================= */

    if (videoViewer) {

        videoViewer.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === videoViewer
                ) {

                    closeVideoViewer();

                }

            }
        );

    }


    /* =========================================
       ESCAPE KEY
    ========================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                videoViewer &&
                videoViewer.classList.contains("active")
            ) {

                closeVideoViewer();

            }

        }
    );


    /* =========================================
       PROJECT MEDIA
    ========================================= */

    const projectMedia =
        document.querySelectorAll(".project-media");


    projectMedia.forEach(function (media) {

        const video =
            media.querySelector("video");

        const button =
            media.querySelector(
                ".video-play-button"
            );


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
           PLAY BUTTON
        ===================================== */

        button.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                openVideoViewer(video);

            }
        );


        /* =====================================
           CLICK VIDEO
        ===================================== */

        video.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                openVideoViewer(video);

            }
        );


        /* =====================================
           PLAY STATE
        ===================================== */

        video.addEventListener(
            "play",
            function () {

                button.textContent = "Ⅱ";

                button.classList.add("playing");

                button.setAttribute(
                    "aria-label",
                    "Pause video"
                );

            }
        );


        /* =====================================
           PAUSE STATE
        ===================================== */

        video.addEventListener(
            "pause",
            function () {

                button.textContent = "▶";

                button.classList.remove("playing");

                button.setAttribute(
                    "aria-label",
                    "Play video"
                );

            }
        );


        /* =====================================
           VIDEO ENDED
        ===================================== */

        video.addEventListener(
            "ended",
            function () {

                progress.style.width = "100%";

            }
        );


        /* =====================================
           UPDATE TIMELINE
        ===================================== */

        video.addEventListener(
            "timeupdate",
            function () {

                if (
                    !video.duration ||
                    !isFinite(video.duration)
                ) {
                    return;
                }


                const percentage =
                    (
                        video.currentTime /
                        video.duration
                    ) * 100;


                progress.style.width =
                    percentage + "%";

            }
        );


        /* =====================================
           VIDEO METADATA
        ===================================== */

        video.addEventListener(
            "loadedmetadata",
            function () {

                progress.style.width = "0%";

            }
        );


        /* =====================================
           CLICK TIMELINE
        ===================================== */

        timeline.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();


                if (
                    !video.duration ||
                    !isFinite(video.duration)
                ) {
                    return;
                }


                const rect =
                    timeline.getBoundingClientRect();


                const clickPosition =
                    event.clientX - rect.left;


                let percentage =
                    clickPosition / rect.width;


                percentage =
                    Math.max(
                        0,
                        Math.min(
                            1,
                            percentage
                        )
                    );


                video.currentTime =
                    percentage * video.duration;

            }
        );

    });


    /* =========================================
       FILTER FUNCTION
    ========================================= */

    function updateProjects() {

        const search =
            searchInput
                ? searchInput.value
                    .toLowerCase()
                    .trim()
                : "";


        let visibleCount = 0;


        projectCards.forEach(function (card) {

            /* =====================================
               ORIENTATION
            ===================================== */

            const isLandscape =
                card.classList.contains(
                    "landscape"
                );

            const isVertical =
                card.classList.contains(
                    "vertical"
                );


            let matchesOrientation = false;


            if (
                currentOrientation ===
                "landscape"
            ) {

                matchesOrientation =
                    isLandscape;

            }

            else if (
                currentOrientation ===
                "vertical"
            ) {

                matchesOrientation =
                    isVertical;

            }


            /* =====================================
               CATEGORY
            ===================================== */

            const cardCategory =
                card.dataset.category;


            let matchesCategory = false;


            if (
                currentCategory === "all"
            ) {

                matchesCategory = true;

            }

            else {

                matchesCategory =
                    cardCategory ===
                    currentCategory;

            }


            /* =====================================
               SEARCH
            ===================================== */

            const text =
                (
                    card.innerText +
                    " " +
                    (
                        card.dataset.title ||
                        ""
                    )
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

                card.classList.remove(
                    "is-hidden"
                );

                visibleCount++;

            }

            else {

                card.classList.add(
                    "is-hidden"
                );


                const video =
                    card.querySelector(
                        "video"
                    );


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

    orientationButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    currentOrientation =
                        this.dataset.filter;


                    orientationButtons.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    this.classList.add(
                        "active"
                    );


                    updateProjects();

                }
            );

        }
    );


    /* =========================================
       CATEGORY BUTTONS
    ========================================= */

    categoryButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    currentCategory =
                        this.dataset.category;


                    categoryButtons.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    this.classList.add(
                        "active"
                    );


                    updateProjects();

                }
            );

        }
    );


    /* =========================================
       LIVE SEARCH
    ========================================= */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                updateProjects();

            }
        );

    }


    /* =========================================
       DEFAULT CATEGORY
       = ALL
    ========================================= */

    categoryButtons.forEach(
        function (btn) {

            btn.classList.remove(
                "active"
            );

        }
    );


    const allCategoryButton =
        document.querySelector(
            '.category-btn[data-category="all"]'
        );


    if (allCategoryButton) {

        allCategoryButton.classList.add(
            "active"
        );

    }


    currentCategory = "all";


    /* =========================================
       DEFAULT ORIENTATION
       = LANDSCAPE
    ========================================= */

    orientationButtons.forEach(
        function (btn) {

            btn.classList.remove(
                "active"
            );

        }
    );


    const landscapeButton =
        document.querySelector(
            '.orientation-btn[data-filter="landscape"]'
        );


    if (landscapeButton) {

        landscapeButton.classList.add(
            "active"
        );

    }


    currentOrientation = "landscape";


    /* =========================================
       INITIAL DISPLAY
    ========================================= */

    updateProjects();


    /* =========================================
       REVEAL ANIMATION
    ========================================= */

    const revealElements =
        document.querySelectorAll(
            ".project-card"
        );


    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.08
            }
        );


    revealElements.forEach(
        function (element) {

            observer.observe(element);

        }
    );

});
