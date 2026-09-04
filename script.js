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
       RESET ONE CARD VIDEO
       Restores poster image
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


        const originalVisibility =
            video.style.visibility;

        video.style.visibility = "hidden";

        video.load();


        requestAnimationFrame(function () {

            requestAnimationFrame(function () {

                video.style.visibility =
                    originalVisibility || "visible";

            });

        });

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
       ONE CARD VIDEO AT A TIME
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
       PAGE RETURN / BROWSER BACK
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


                const media =
                    video.closest(".project-media");

                if (media) {

                    const progress =
                        media.querySelector(
                            ".video-progress"
                        );

                    if (progress) {
                        progress.style.width = "0%";
                    }

                }

            });

        }
    );


    /* =========================================
       TAB / PAGE VISIBILITY
    ========================================= */

    document.addEventListener(
        "visibilitychange",
        function () {

            if (
                document.visibilityState ===
                "hidden"
            ) {

                videos.forEach(
                    function (video) {

                        video.pause();

                    }
                );

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

        videos.forEach(function (otherVideo) {

            otherVideo.pause();

            try {
                otherVideo.currentTime = 0;
            }

            catch (error) {
                /* Ignore */
            }

        });


        /* =====================================
           SET VIEWER VIDEO
        ===================================== */

        viewerVideo.pause();

        viewerVideo.removeAttribute("src");

        viewerVideo.load();


        viewerVideo.src =
            videoURL;


        /* =====================================
           SET POSTER
        ===================================== */

        const poster =
            video.getAttribute("poster");


        if (poster) {

            viewerVideo.poster =
                poster;

        }


        /* =====================================
           OPEN VIEWER
        ===================================== */

        videoViewer.classList.add(
            "active"
        );

        document.body.style.overflow =
            "hidden";


        /* =====================================
           LOAD VIDEO
        ===================================== */

        viewerVideo.load();


        /* =====================================
           PLAY AFTER VIDEO IS READY
        ===================================== */

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

            viewerVideo.currentTime =
                0;

        }

        catch (error) {
            /* Ignore */
        }


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
       CLICK OUTSIDE VIDEO
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
       ESCAPE KEY
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


        timeline.appendChild(
            progress
        );


        media.appendChild(
            timeline
        );


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

                video.currentTime =
                    0;

                progress.style.width =
                    "0%";

                video.load();

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

                progress.style.width =
                    "0%";

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

    });


    /* =========================================
       FILTER FUNCTION
       
       Includes:
       - Orientation
       - Category
       - Search
       - Animation reset
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

            /* =================================
               ORIENTATION
            ================================= */

            const isLandscape =
                card.classList.contains(
                    "landscape"
                );


            const isVertical =
                card.classList.contains(
                    "vertical"
                );


            let matchesOrientation =
                false;


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


            /* =================================
               CATEGORY
            ================================= */

            const cardCategory =
                card.dataset.category;


            let matchesCategory =
                false;


            if (
                currentCategory ===
                "all"
            ) {

                matchesCategory =
                    true;

            }

            else {

                matchesCategory =
                    cardCategory ===
                    currentCategory;

            }


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
               FINAL RESULT
            ================================= */

            if (
                matchesOrientation &&
                matchesCategory &&
                matchesSearch
            ) {

                /* =============================
                   SHOW CARD
                ============================= */

                card.classList.remove(
                    "is-hidden"
                );


                /*
                   Remove old animation state
                   so the animation can replay.
                */

                card.classList.remove(
                    "visible"
                );


                /*
                   Set stagger delay.
                   
                   0.05s between each card.
                */

                card.style.setProperty(
                    "--card-delay",
                    (animationIndex * 0.05) + "s"
                );


                animationIndex++;

                visibleCount++;


                /*
                   Force browser reflow.
                   This is important because it
                   allows the animation to restart.
                */

                void card.offsetWidth;


                /*
                   Start animation.
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

                /* =============================
                   HIDE CARD
                ============================= */

                card.classList.add(
                    "is-hidden"
                );


                card.classList.remove(
                    "visible"
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
           PIECES COUNT
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
                       Reset videos before changing
                       orientation.
                    */

                    resetAllCardVideos();


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


    currentCategory =
        "all";


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


    currentOrientation =
        "landscape";


    /* =========================================
       INITIAL DISPLAY
    ========================================= */

    updateProjects();


    /* =========================================
       INITIAL POSTER RESET
    ========================================= */

    requestAnimationFrame(
        function () {

            resetAllCardVideos();

        }
    );


    /* =========================================
       INTERSECTION OBSERVER
       
       Keeps the same reveal animation when
       cards enter the viewport while scrolling.
    ========================================= */

    if (
        "IntersectionObserver" in window
    ) {

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

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.08
                }
            );


        projectCards.forEach(
            function (card) {

                observer.observe(card);

            }
        );

    }

    else {

        projectCards.forEach(
            function (card) {

                card.classList.add(
                    "visible"
                );

            }
        );

    }

});
