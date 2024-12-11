
document.addEventListener(`DOMContentLoaded`, () => {
    const backgroundMusic = document.querySelector(`#background-music`);
    if (!backgroundMusic) {
        console.error("Background music element not found");
    }

    backgroundMusic.addEventListener(`error`, (event) => {
        console.error(`Audio error:`, event);
    });

    const form = document.querySelector(`#mood-form`);
    const moodInput = document.querySelector(`#mood-input`);
    const noteInput = document.querySelector(`#note-input`);
    const moodList = document.querySelector(`#mood-list`);
    const quoteContainer = document.querySelector(`#quote-container`);
    
    document.body.addEventListener(`click`, () => {
        backgroundMusic.play().catch (error => {
            console.log(`Error playing audio:`, error);
        });
    }, { once: true});

    let moods = JSON.parse(localStorage.getItem(`moods`)) ||  [];
    let dates = JSON.parse(localStorage.getItem(`dates`)) ||  [];


    const ctx = document.getElementById(`mood-chart`).getContext(`2d`);
        let moodChart = new Chart(ctx, {
            type: `line`,
            data: {
                labels: dates,
                datasets:[{
                    label: `Mood Trends`,
                    data: moods,
                    borderColor: `rgba(75, 192, 192, 1)`,
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: {
                        type: `category`,
                        title: {
                            diaplay: true,
                            text: `date`,
                        },
                    },
                    y: {
                        min: 0,
                        max: 5,
                        ticks: {
                            stepSize: 1
                        },
                        title: {
                            display: true,
                            text: `Mood Score (1-5)`
                        }
                    }
                }
            }
        });

        function updateMoodChart() {
            moodChart.update();
        }

        // form submission handler:

    form.addEventListener(`submit`, async (event) => {
        event.preventDefault();

    const moodText = moodInput.value.trim();
    const noteText = noteInput.value.trim();
        if(moodText === ``) {
            alert("Please enter a mood before you submit");
        
            return;
        }
    const today = new Date();

    const createMoodEntry = createMoodEntry(moodText, noteText, today);
    moodList.appendChild(moodEntry);
    
    const moodScores = {
        "Sad": 1,
        "Neutral": 3,
        "Happy": 5,
        "Very Sad": 0,
        "Very Happy": 6

    };
   

    const moodScore = moodScores[moodText] || 3;  


        moods.push(moodScore);
        dates.push(today);

    localStorage.setItem('moods', JSON.stringify(moods));
    localStorage.setItem('dates', JSON.stringify(dates));

        moodInput.value = ``;
        noteInput.value = ``;

        // fetching and Update Chart

        await fetchQuote();
        updateMoodChart();
    });

    function createMoodEntry(mood, note, date) {
        const div = document.createElement(`div`);
        div.classList.add(`mood-entry`);

        const moodElement = document.createElement(`p`);
        moodElement.innerText = `Mood: ${mood}`;
        div.appendChild(moodElement);

        if(note) {
            const noteElement = document.createElement(`span`);
            noteElement.innerText = `Note: ${note}`;
            div.appendChild(noteElement);
        }
        const dateElement = document.createElement(`span`);
        dateElement.innerText = ` Date: ${date}`;
        div.appendChild(dateElement);

        return div;
    }
// fetching the quotes from an API and put them in a quoteContainer. 

    async function fetchQuote() {
        try {
            const response = await fetch(`https://zenquotes.io/api/random`);
            
            if (!response.ok){
                throw new Error(`Network response was not ok`);
            }

            const responseData = await response.json();
            console.log(`Quote data:`, responseData);
            
            if (responseData && responseData.data && responseData.data[0]) {
                const quote = responseData.data[0].quote;
                const author = responseData.data[0].author;
        

            quoteContainer.innerHTML = `<p>${quote} - <em>${author}</em></p>`;
    } else {
        throw new Error("Unexpected response structure");
    }

        } catch (error) {
            console.error(`Error fetching quote:`, error);
            quoteContainer.innerHTML =`<p>Could not fetch a quote at this time. Try back again.</p>`;
        }
        
    }

    moods.forEach((mood, index)=> {
        const note = ``;
        const date = new Date(dates[index]);
        const moodEntry = createMoodEntry(mood, note, date);
        moodList.appendChild(moodEntry);
    });
    
// initializing the fetch when the page load up

    fetchQuote();

    updateMoodChart();

        const checkLocationButton = document.querySelector(`#check-location`);
        const locationInfo = document.querySelector(`#location-info`);

        checkLocationButton.addEventListener(`click`, () => {
        locationInfo.textContent = `Current URL: ${window.location.href}`;

        });

        const historyBackButton = document.querySelector(`#history-back`);
        historyBackButton.addEventListener(`click`, () => {
            window.history.back();

        });

});