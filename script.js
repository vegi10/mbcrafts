document.addEventListener("DOMContentLoaded", function () {

    const videos = Array.from(document.querySelectorAll(".project-card video"));
    const orientationButtons = document.querySelectorAll(".orientation-btn");
    const categoryButtons = document.querySelectorAll(".category-btn");
    const projectCards = Array.from(document.querySelectorAll(".project-card"));
    const piecesCount = document.getElementById("piecesCount");
    const searchInput = document.getElementById("searchInput");
    const videoViewer = document.getElementById("videoViewer");
    const viewerVideo = document.getElementById("viewerVideo");
    const videoViewerClose = document.getElementById("videoViewerClose");
    const menuButton = document.querySelector(".menu-button");
    const navLinks = document.querySelector(".nav-links");
    const pageLinks = document.querySelectorAll('a[href]:not([target="_blank"])');
    const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let currentCategory = "all";
    let currentOrientation = "landscape";
    let searchTimer = null;
    let animationToken = 0;

    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    function closeMenu() {
        if (!navLinks || !menuButton) return;
        navLinks.classList.remove("open");
        menuButton.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open menu");
    }

    function toggleMenu() {
        if (!navLinks || !menuButton) return;
        const isOpen = navLinks.classList.toggle("open");
        menuButton.classList.toggle("open", isOpen);
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    }

    if (menuButton && navLinks) {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.addEventListener("click", function (event) {
            event.stopPropagation();
            toggleMenu();
        });

        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("click", function (event) {
            if (!navLinks.contains(event.target) && !menuButton.contains(event.target)) {
                closeMenu();
            }
        });
    }

    /* =====================================================
       PAGE TRANSITIONS
    ===================================================== */

    function isInternalPageLink(link) {
        if (!link || !link.href) return false;
        if (link.target === "_blank" || link.hasAttribute("download")) return false;
        if (link.origin !== window.location.origin) return false;
        if (link.pathname === window.location.pathname && link.hash) return false;
        if (link.pathname === window.location.pathname && !link.hash) return false;
        return /\.html?$/.test(link.pathname) || link.pathname.endsWith("/");
    }

    pageLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            if (!isInternalPageLink(link)) return;
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

            event.preventDefault();
            closeMenu();
            document.body.classList.add("page-leaving");

            window.setTimeout(function () {
                window.location.href = link.href;
            }, 220);
        });
    });

    window.addEventListener("pageshow", function () {
        document.body.classList.remove("page-leaving");
    });

    /* =====================================================
       VIDEO RESET / PERFORMANCE
    ===================================================== */

    function resetCardVideo(video) {
        if (!video) return;

        video.pause();

        try {
            video.currentTime = 0;
        } catch (error) {
            /* Ignore seek errors before metadata is ready. */
        }

        const progress = video.closest(".project-media")?.querySelector(".video-progress");
        if (progress) progress.style.width = "0%";
    }

    function resetAllCardVideos(except) {
        videos.forEach(function (video) {
            if (video !== except) resetCardVideo(video);
        });
    }

    document.addEventListener("play", function (event) {
        const currentVideo = event.target;
        if (!currentVideo.matches || !currentVideo.matches(".project-card video")) return;
        resetAllCardVideos(currentVideo);
    }, true);

    document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "hidden") {
            videos.forEach(function (video) { video.pause(); });
        }
    });

    window.addEventListener("pagehide", function () {
        videos.forEach(function (video) { resetCardVideo(video); });
    });

    /* Pause videos that are no longer visible. */
    if ("IntersectionObserver" in window) {
        const videoObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) resetCardVideo(entry.target);
            });
        }, { threshold: 0.05, rootMargin: "80px" });

        videos.forEach(function (video) {
            videoObserver.observe(video);
        });
    }

    /* =====================================================
       VIDEO VIEWER
    ===================================================== */

    function openVideoViewer(video) {
        if (!videoViewer || !viewerVideo || !video) return;

        const source = video.querySelector("source");
        const videoURL = source ? (source.src || source.getAttribute("src")) : "";
        if (!videoURL) return;

        resetAllCardVideos();

        viewerVideo.pause();
        viewerVideo.removeAttribute("src");
        viewerVideo.removeAttribute("poster");
        viewerVideo.load();

        viewerVideo.src = videoURL;

        const poster = video.getAttribute("poster");
        if (poster) viewerVideo.poster = poster;

        videoViewer.classList.add("active");
        document.body.style.overflow = "hidden";

        viewerVideo.onloadedmetadata = function () {
            viewerVideo.currentTime = 0;
            viewerVideo.play().catch(function () {});
        };

        viewerVideo.load();
    }

    function closeVideoViewer() {
        if (!videoViewer || !viewerVideo) return;

        viewerVideo.pause();
        viewerVideo.onloadedmetadata = null;
        viewerVideo.removeAttribute("src");
        viewerVideo.removeAttribute("poster");
        viewerVideo.load();

        videoViewer.classList.remove("active");
        document.body.style.overflow = "";
    }

    if (videoViewerClose) {
        videoViewerClose.addEventListener("click", function (event) {
            event.stopPropagation();
            closeVideoViewer();
        });
    }

    if (videoViewer) {
        videoViewer.addEventListener("click", function (event) {
            if (event.target === videoViewer) closeVideoViewer();
        });
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            if (videoViewer?.classList.contains("active")) closeVideoViewer();
            if (navLinks?.classList.contains("open")) closeMenu();
        }
    });

    /* =====================================================
       CARD VIDEO INTERACTIONS
    ===================================================== */

    document.querySelectorAll(".project-media").forEach(function (media) {
        const video = media.querySelector("video");
        const button = media.querySelector(".video-play-button");
        const timeline = media.querySelector(".video-timeline");
        const progress = timeline?.querySelector(".video-progress");

        if (!video) return;

        if (button) {
            button.addEventListener("click", function (event) {
                event.stopPropagation();
                openVideoViewer(video);
            });
        }

        video.addEventListener("click", function (event) {
            event.stopPropagation();
            openVideoViewer(video);
        });

        if (hoverCapable) {
            media.addEventListener("mouseenter", function () {
                resetAllCardVideos(video);
                video.play().catch(function () {});
            });

            media.addEventListener("mouseleave", function () {
                resetCardVideo(video);
            });
        }

        video.addEventListener("play", function () {
            if (!button) return;
            button.textContent = "Ⅱ";
            button.classList.add("playing");
            button.setAttribute("aria-label", "Pause video");
        });

        video.addEventListener("pause", function () {
            if (!button) return;
            button.textContent = "▶";
            button.classList.remove("playing");
            button.setAttribute("aria-label", "Play video");
        });

        video.addEventListener("ended", function () {
            resetCardVideo(video);
        });

        video.addEventListener("timeupdate", function () {
            if (!progress || !video.duration || !Number.isFinite(video.duration)) return;
            progress.style.width = ((video.currentTime / video.duration) * 100) + "%";
        });

        if (timeline) {
            timeline.addEventListener("click", function (event) {
                event.stopPropagation();
                if (!video.duration || !Number.isFinite(video.duration)) return;

                const rect = timeline.getBoundingClientRect();
                const percentage = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
                video.currentTime = percentage * video.duration;
            });
        }
    });

    /* =====================================================
       SEARCH + FILTERING
    ===================================================== */

    function normalizeText(value) {
        return String(value || "")
            .toLowerCase()
            .replace(/[&·.,/]+/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function updateProjects(animate) {
        const search = normalizeText(searchInput ? searchInput.value : "");
        let visibleCount = 0;
        const visibleCards = [];

        projectCards.forEach(function (card) {
            const isLandscape = card.classList.contains("landscape");
            const isVertical = card.classList.contains("vertical");
            const cardCategory = card.dataset.category || "";
            const searchableText = normalizeText(
                (card.innerText || "") + " " + (card.dataset.title || "") + " " + cardCategory
            );

            const matchesOrientation =
                (currentOrientation === "landscape" && isLandscape) ||
                (currentOrientation === "vertical" && isVertical);

            const matchesCategory =
                currentCategory === "all" || cardCategory === currentCategory;

            const matchesSearch = !search || searchableText.includes(search);
            const shouldShow = matchesOrientation && matchesCategory && matchesSearch;

            if (shouldShow) {
                card.classList.remove("is-hidden");
                visibleCards.push(card);
                visibleCount++;
            } else {
                card.classList.add("is-hidden");
                resetCardVideo(card.querySelector("video"));
            }
        });

        if (piecesCount) {
            piecesCount.textContent = visibleCount + (visibleCount === 1 ? " piece" : " pieces");
        }

        updateEmptyState(visibleCount);

        if (animate) animateVisibleCards(visibleCards);
    }

    function updateEmptyState(visibleCount) {
        const grid = document.querySelector(".portfolio-grid");
        if (!grid) return;

        let empty = document.getElementById("portfolioEmpty");

        if (!empty) {
            empty = document.createElement("div");
            empty.id = "portfolioEmpty";
            empty.className = "portfolio-empty";
            empty.innerHTML = '<strong>No projects found.</strong><span>Try another search or category.</span>';
            grid.parentNode.insertBefore(empty, grid.nextSibling);
        }

        empty.hidden = visibleCount !== 0;
    }

    orientationButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            currentOrientation = this.dataset.filter || "landscape";

            orientationButtons.forEach(function (btn) {
                btn.classList.toggle("active", btn === button);
            });

            resetAllCardVideos();
            updateProjects(true);
        });
    });

    categoryButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            currentCategory = this.dataset.category || "all";

            categoryButtons.forEach(function (btn) {
                btn.classList.toggle("active", btn === button);
            });

            updateProjects(true);
        });
    });

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            window.clearTimeout(searchTimer);
            searchTimer = window.setTimeout(function () {
                updateProjects(true);
            }, 120);
        });
    }

    /* =====================================================
       CARD ENTRANCE ANIMATION — WEB ANIMATIONS API
       This is intentionally independent from the old CSS
       animation approach that was unreliable before.
    ===================================================== */

    function animateVisibleCards(cards) {
        const token = ++animationToken;
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        cards.forEach(function (card, index) {
            if (card._entranceAnimation) {
                card._entranceAnimation.cancel();
                card._entranceAnimation = null;
            }

            card.style.opacity = reduceMotion ? "1" : "0";
            card.style.transform = reduceMotion ? "none" : "translateY(26px)";

            if (reduceMotion) return;

            card._entranceAnimation = card.animate(
                [
                    { opacity: 0, transform: "translateY(26px)" },
                    { opacity: 1, transform: "translateY(0)" }
                ],
                {
                    duration: 620,
                    delay: Math.min(index * 55, 440),
                    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                    fill: "both"
                }
            );

            card._entranceAnimation.finished.then(function () {
                if (token === animationToken) {
                    card.style.opacity = "1";
                    card.style.transform = "none";
                }
            }).catch(function () {});
        });
    }

    /* =====================================================
       INITIAL STATE
    ===================================================== */

    categoryButtons.forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.category === "all");
    });

    orientationButtons.forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.filter === "landscape");
    });

    updateProjects(false);

    requestAnimationFrame(function () {
        const initialCards = projectCards.filter(function (card) {
            return !card.classList.contains("is-hidden");
        });
        animateVisibleCards(initialCards);
    });
});
