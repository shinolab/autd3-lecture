document.addEventListener('DOMContentLoaded', () => {
    const stepButton = document.getElementById('stepButton');
    const transitionCheckbox = document.getElementById('transitionCheckbox');
    const timeStepDisplay = document.getElementById('timeStepDisplay');
    const activeSegmentDisplay = document.getElementById('activeSegmentDisplay');

    const numAddresses = 4;

    const addressBoxes1 = document.querySelectorAll('#segment1 .address-box:not(.header)');
    const addressBoxes2 = document.querySelectorAll('#segment2 .address-box:not(.header)');

    let timeStep = 0;
    let activeSegmentIndex = 1;
    let transitionEnabled = false;
    let currentAddress1 = 0;
    let currentAddress2 = 0;

    transitionCheckbox.addEventListener('change', (event) => {
        transitionEnabled = event.target.checked;
    });

    function updateHighlights() {
        addressBoxes1.forEach(box => {
            box.classList.remove('active-segment-highlight', 'inactive-segment-highlight');
            if (parseInt(box.dataset.addr, 10) === currentAddress1) {
                box.classList.add(activeSegmentIndex === 1 ? 'active-segment-highlight' : 'inactive-segment-highlight');
            }
        });

        addressBoxes2.forEach(box => {
            box.classList.remove('active-segment-highlight', 'inactive-segment-highlight');
            if (parseInt(box.dataset.addr, 10) === currentAddress2) {
                box.classList.add(activeSegmentIndex === 2 ? 'active-segment-highlight' : 'inactive-segment-highlight');
            }
        });

        activeSegmentDisplay.textContent = activeSegmentIndex;
    }

    stepButton.addEventListener('click', () => {
        timeStep++;
        timeStepDisplay.textContent = timeStep;

        currentAddress1 = timeStep % numAddresses;
        currentAddress2 = Math.floor(timeStep / 2) % numAddresses;

        if (transitionEnabled) {
            const inactiveSegmentIndex = activeSegmentIndex === 1 ? 2 : 1;
            const inactiveAddress = inactiveSegmentIndex === 1 ? currentAddress1 : currentAddress2;

            if (inactiveAddress === 0) {
                transitionEnabled = false;
                transitionCheckbox.checked = false;
                activeSegmentIndex = inactiveSegmentIndex;
            }
        }

        updateHighlights();
    });

    timeStepDisplay.textContent = timeStep;
    activeSegmentDisplay.textContent = activeSegmentIndex;
    transitionEnabled = transitionCheckbox.checked;
    updateHighlights();
});