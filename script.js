document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const cards = document.querySelectorAll(
        ".portfolio-grid .project-card"
    );

    const piecesText = document.querySelector(
        ".pieces-count span"
    );


    /* =====================================================
       UPDATE PIECES COUNT
    ===================================================== */

    function updateCount() {

        let visibleCount = 0;

        cards.forEach(function (card) {

            if (!card.hidden) {
                visibleCount++;
            }

        });

        if (piecesText) {
            piecesText.textContent =
                visibleCount + " pieces";
        }
    }


    /* =====================================================
       SHOW LANDSCAPE / VERTICAL
    ===================================================== */

    function showOrientation(type) {

        cards.forEach(function (card) {

            if (card.classList.contains(type)) {

                card.hidden = false;

            } else {

                card.hidden = true;

                /* Stop hidden videos */
                const video = card.querySelector("video");

                if (video) {
                    video.pause();
                    video.currentTime = 0;
                }

            }

        });


        /* Update active button */

        document
            .querySelectorAll(".orientation-btn")
            .forEach(function (button) {

                button.classList.remove("active");

            });


        const activeButton = document.querySelector(
            '.orientation-btn[data-filter="' + type + '"]'
        );

        if (activeButton) {
            activeButton.classList.add("active");
        }


        updateCount();
    }


    /* =====================================================
       ORIENTATION BUTTON CLICK
       EVENT DELEGATION
    ===================================================== */

    document.addEventListener("click", function (event) {

        const button =
            event.target.closest(".orientation-btn");


        if (!button) {
            return;
        }


        const filter =
            button.getAttribute("data-filter");


        if (filter === "landscape") {

            showOrientation("landscape");

        }


        if (filter === "vertical") {

            showOrientation("vertical");

        }

    });


    /* =====================================================
       VIDEO HOVER PLAY
    ===================================================== */

    cards.forEach(function (card) {

        const video =
            card.querySelector("video");


        if (!video) {
            return;
        }


        video.addEventListener("mouseenter", function () {

            video.play().catch(function (error) {

                console.log(
                    "Video could not play:",
                    error
                );

            });

        });


        video.addEventListener("mouseleave", function () {

            video.pause();
            video.currentTime = 0;

        });

    });


    /* =====================================================
       INITIAL STATE
       LANDSCAPE = 7
    ===================================================== */

    showOrientation("landscape");

});
