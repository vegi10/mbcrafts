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
       VIDEO VIEWER
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
       RESET CARD VIDEO
    ========================================= */

    function resetCardVideo(video) {

        if (!video) {
            return;
        }

        video.pause();

        try {
            video.currentTime = 0;
        }

        catch (error) {
            /* Ignore */
        }

        const media =
            video.closest(".project-media");

        if (media) {

            const progress =
                media.querySelector(".video-progress");

            if (progress) {
                progress.style.width = "0%";
            }
        }

        video.load();
    }


    /* =========================================
       RESET ALL CARD VIDEOS
    ========================================= */

    function resetAllCardVideos() {

        videos.forEach(function (video) {

            resetCardVideo(video);

        });

    }


    /* =========================================
       ONLY ONE CARD VIDEO AT A TIME
    ========================================= */

    document.addEventListener(
        "play",
        function (event) {

            const currentVideo =
                event.target;

            if (
                !currentVideo.matches(
                    ".project-card video"
                )
            ) {
                return;
            }

            videos.forEach(function (video) {

                if (video !== currentVideo) {
                    resetCardVideo(video);
                }

            });

        },
        true
    );


    /* =========================================
       PAGE RETURN
    ========================================= */

    window.addEventListener(
        "pageshow",
        function () {

            resetAllCardVideos();

        }
    );


    /* =========================================
       PAGE LEAVE
    ========================================= */

    window.addEventListener(
        "pagehide",
        function () {

            videos.forEach(function (video) {

                video.pause();

                try {
                    video.currentTime = 0;
                }

                catch (error) {
                    /* Ignore */
                }

            });

        }
    );


    /* =========================================
       TAB VISIBILITY
    ========================================= */

    document.addEventListener(
        "visibilitychange",
        function () {

            if (
                document.visibilityState ===
                "hidden"
            ) {

                videos.forEach(function (video) {

                    video.pause();

                });

            }

        }
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

        const videoURL =
            source.src ||
            source.getAttribute("src");

        if (!videoURL) {

            console.log(
                "Video source is empty."
            );

            return;
        }


        /* STOP CARD VIDEOS */

        videos.forEach(function (otherVideo) {

            otherVideo.pause();

            try {
                otherVideo.currentTime = 0;
            }

            catch (error) {
                /* Ignore */
            }

        });


        /* RESET VIEWER */

        viewerVideo.pause();

        viewerVideo.removeAttribute("src");

        viewerVideo.removeAttribute("poster");

        viewerVideo.load();


        /* SET SOURCE */

        viewerVideo.src =
            videoURL;


        /* SET POSTER */

        const poster =
            video.getAttribute("poster");

        if (poster) {

            viewerVideo.poster =
                poster;

        }


        /* OPEN MODAL */

        videoViewer.classList.add(
            "active"
        );

        document.body.style.overflow =
            "hidden";


        /*
           Set event BEFORE load().
           This avoids missing the metadata event.
        */

        viewerVideo.onloadedmetadata =
            function () {

                viewerVideo.currentTime =
                    0;

                viewerVideo.play().catch(
                    function () {

                        console.log(
                            "Autoplay was blocked."
                        );

                    }
                );

            };


        viewerVideo.load();

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

        viewerVideo.pause();

        try {
            viewerVideo.currentTime = 0;
        }

        catch (error) {
            /* Ignore */
        }

        viewerVideo.onloadedmetadata =
            null;

        viewerVideo.removeAttribute(
            "src"
        );

        viewerVideo.removeAttribute(
            "poster"
        );

        viewerVideo.load();

        videoViewer.classList.remove(
            "active"
        );

        document.body.style.overflow =
            "";

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
       CLICK OUTSIDE VIEWER
    ========================================= */

    if (videoViewer) {

        videoViewer.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    videoViewer
                ) {

                    closeVideoViewer();

                }

            }
        );

    }


    /* =========================================
       ESCAPE
    ========================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                videoViewer &&
                videoViewer.classList.contains(
                    "active"
                )
            ) {

                closeVideoViewer();

            }

        }
    );


    /* =========================================
       PROJECT MEDIA
    ========================================= */

    const projectMedia =
        document.querySelectorAll(
            ".project-media"
        );


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
           USE EXISTING TIMELINE
           Do NOT create another one.
        ===================================== */

        const timeline =
            media.querySelector(
                ".video-timeline"
            );

        const progress =
            timeline
                ? timeline.querySelector(
                    ".video-progress"
                )
                : null;


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
           VIDEO CLICK
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

                button.textContent =
                    "Ⅱ";

                button.classList.add(
                    "playing"
                );

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

                button.textContent =
                    "▶";

                button.classList.remove(
                    "playing"
                );

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

                video.currentTime = 0;

                if (progress) {
                    progress.style.width =
                        "0%";
                }

                video.load();

            }
        );


        /* =====================================
           TIMELINE UPDATE
        ===================================== */

        video.addEventListener(
            "timeupdate",
            function () {

                if (
                    !progress ||
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

                if (progress) {

                    progress.style.width =
                        "0%";

                }

            }
        );


        /* =====================================
           TIMELINE CLICK
        ===================================== */

        if (timeline) {

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
                        event.clientX -
                        rect.left;

                    let percentage =
                        clickPosition /
                        rect.width;

                    percentage =
                        Math.max(
                            0,
                            Math.min(
                                1,
                                percentage
                            )
                        );

                    video.currentTime =
                        percentage *
                        video.duration;

                }
            );

        }

    });


    /* =========================================
       FILTER + ANIMATION
    ========================================= */

    function updateProjects() {

        const search =
            searchInput
                ? searchInput.value
                    .toLowerCase()
                    .trim()
                : "";


        let visibleCount = 0;
        let animationIndex = 0;


        projectCards.forEach(function (card) {

            const isLandscape =
                card.classList.contains(
                    "landscape"
                );

            const isVertical =
                card.classList.contains(
                    "vertical"
                );


            /* =================================
               ORIENTATION
            ================================= */

            const matchesOrientation =
                currentOrientation === "landscape"
                    ? isLandscape
                    : currentOrientation === "vertical"
                        ? isVertical
                        : false;


            /* =================================
               CATEGORY
            ================================= */

            const cardCategory =
                card.dataset.category || "";


            const matchesCategory =
                currentCategory === "all" ||
                cardCategory === currentCategory;


            /* =================================
               SEARCH
            ================================= */

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


            /* =================================
               FINAL MATCH
            ================================= */

            const shouldShow =
                matchesOrientation &&
                matchesCategory &&
                matchesSearch;


            if (shouldShow) {

                /* SHOW CARD */

                card.classList.remove(
                    "is-hidden"
                );


                /*
                   Remove visible first.
                   This resets the animation.
                */

                card.classList.remove(
                    "visible"
                );


                /*
                   Set stagger delay.
                */

                card.style.setProperty(
                    "--card-delay",
                    (animationIndex * 0.05) + "s"
                );


                animationIndex++;
                visibleCount++;


                /*
                   Force browser reflow.
                */

                void card.offsetWidth;


                /*
                   Add visible on next frame.
                */

                requestAnimationFrame(
                    function () {

                        card.classList.add(
                            "visible"
                        );

                    }
                );

            }

            else {

                /* HIDE CARD */

                card.classList.remove(
                    "visible"
                );

                card.classList.add(
                    "is-hidden"
                );

                card.style.removeProperty(
                    "--card-delay"
                );


                const video =
                    card.querySelector(
                        "video"
                    );

                if (video) {

                    resetCardVideo(
                        video
                    );

                }

            }

        });


        /* =================================
           COUNT
        ================================= */

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


                    /*
                       Reset videos first.
                    */

                    resetAllCardVideos();


                    /*
                       Re-run filter and animation.
                    */

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
       SEARCH
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


    currentCategory =
        "all";


    /* =========================================
       DEFAULT ORIENTATION
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


    currentOrientation =
        "landscape";


    /* =========================================
       INITIAL DISPLAY
    ========================================= */

    updateProjects();


    /* =========================================
       INITIAL VIDEO RESET
    ========================================= */

    requestAnimationFrame(
        function () {

            resetAllCardVideos();

        }
    );

});
