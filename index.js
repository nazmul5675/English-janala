const createElements = (arr) => {
    const htmlElements = arr.map(element => `<button class="btn text-base"> ${element}<button>`);
    return htmlElements;
};
const manageSpinner = (status) => {
    if (status === true) {
        document.getElementById('spiner1').classList.remove('hidden');
        document.getElementById('wordContainer').classList.add('hidden')
    } else {
        document.getElementById('wordContainer').classList.remove('hidden');
        document.getElementById('spiner1').classList.add('hidden')
    }
}

// button load and display
const loadLessons = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then(res => res.json())
        .then(data => displayLesson(data.data))
}
const removeActive = () => {
    const removeActive = document.querySelectorAll('.remove-active');
    removeActive.forEach(btn => btn.classList.remove('active'));
}
const loadLevelWord = (id) => {
    manageSpinner(true);
    fetch(`https://openapi.programming-hero.com/api/level/${id}`)
        .then(res => res.json())
        .then(data => {

            removeActive();//remove all active class
            const clickedBtn = document.getElementById(`lesson-${id}`)
            clickedBtn.classList.add('active')

            displayWordDiv(data.data)
        })
}

const wordLoadDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`
    const res = await fetch(url)
    const details = await res.json()
    displayWordDetails(details)
}



const displayWordDetails = (word) => {
    console.log(word);
    const modalDivContainer = document.getElementById('modalDiv');
    modalDivContainer.innerHTML = `<div class="m-5 p-5 border-b-cyan-100 shadow-lg space-y-5">
        <h1 class="font-bold text-3xl ">${word.data.word} (<i class="fa-solid fa-microphone-lines"></i> ${word.data.pronunciation})</h1>
        <div>
            <p class="font-bold text-xl">meaning</p>
            <p class="text-xl hind-siliguri">${word.data.meaning}</p>
        </div>
        <div>
            <p class="font-bold text-xl">Parts Of Speech</p>
            <p class="font-normal text-base">${word.data.partsOfSpeech}</p>
        </div>
        <div>
            <p class="font-bold text-xl">Example</p>
            <p class="font-normal text-base">${word.data.sentence}</p>
        </div>
        <div>
            <p class="hind-siliguri font-bold  text-xl">সমার্থক শব্দ গুলো</p>
            <div>
                ${createElements(word.data.synonyms)}
            </div>
        </div>
    </div>`
    document.getElementById("my_modal_5").showModal();
}

const displayWordDiv = (words) => {
    const wordContainer = document.getElementById('wordContainer')
    wordContainer.innerHTML = '';
    if (words.length === 0) {
        const alartDiv = document.createElement('div')
        alartDiv.className = "bg-slate-100 flex flex-col justify-center items-center mx-auto w-full rounded-xl p-10 col-span-3";
        alartDiv.innerHTML = `
        <img src="./assets/alert-error.png" alt="">
                <p class="text-base">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h1 class="text-3xl hind-siliguri font-bold">নেক্সট Lesson এ যান</h1>
            `
        wordContainer.appendChild(alartDiv)
    }

    for (const word of words) {



        const wordDiv = document.createElement('div');
        wordDiv.innerHTML = `
       
        
        <div class="bg-white shadow-lg p-10 rounded-xl space-y-4 col-span-1">
          <h1 class="font-bold text-3xl">${word.word ? `${word.word}` : "শব্দ পাওয়া যায় নি"}</h1>
          <p class="font-normal text-xl">Meaning /Pronunciation</p>
          <h1 class="hind-siliguri font-semibold text-3xl">" ${word.meaning ? `${word.meaning}` : "অর্থ পাওয়া যায় নি"} / ${word.pronunciation} "</h1>
          <div class="flex justify-between">
            <button onclick="wordLoadDetail(${word.id})" class="btn bg-sky-200 hover:bg-sky-300 " >
            <i  class="fa-solid fa-circle-info "></i>
            </button>
            <i class="fa-solid fa-volume-high bg-sky-200 hover:bg-sky-300 p-3 rounded-md"></i>
          </div>
        </div>
   
        `
        wordContainer.appendChild(wordDiv)
    }
    manageSpinner(false)
}

const displayLesson = (lesson) => {

    const lessonLevelBtnContainerDiv = document.getElementById('lessonLevelBtn')
    lessonLevelBtnContainerDiv.innerHTML = ''
    lesson.forEach(element => {
        const buttonDiv = document.createElement('div')
        // buttonDiv.id = `lesson-${element.id}`

        buttonDiv.innerHTML = `
        <button id = "lesson-${element.level_no}" onclick="loadLevelWord(${element.level_no})" class="btn btn-outline btn-primary remove-active" >
                 <i class="fa-solid fa-book-open"></i> 
                    Lesson - ${element.level_no} </button> `;
        lessonLevelBtnContainerDiv.appendChild(buttonDiv)
    })
}

loadLessons()

document.getElementById('btnSearch').addEventListener('click', () => {
    removeActive()
    const searchValue = document.getElementById('inputSearch').value.trim().toLowerCase();
    console.log(searchValue);
    fetch('https://openapi.programming-hero.com/api/words/all')
        .then(res => res.json())
        .then(data => {
            const allWords = data.data;
            // console.log(allWords);
            const filterWords = allWords.filter(word => word.word.toLowerCase().includes(searchValue))
            displayWordDiv(filterWords)
        })

})