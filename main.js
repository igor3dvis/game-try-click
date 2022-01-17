// Игра "ПОЙМАЙ КРОТА".
// Важно!!! Размер игрового поля сейчас не должен быть больше 10х10!!!
// Это позволяет "собирать" в массив сыгранных клеток двузначные числа,
// которые формируются из номера строки и колонки.
// Если нужно игровое поле большего размера, нужно:
// 1- переписать функцию getRandomCell так, что бы при проверке числа брались 
//    не из общего массива, а осуществлялся проход по двум отдельным массивам строк 
//    и колонок: 
//      do{
//    
//      }while(row.includes && cell.includes)
// 2 - переписать объект gameCount и все что зависит от этого кода

const FIELD_CELLS_COUNT = 10; // Field size CELLxCELL
const CELL_SIZE = 30; // px

// корневые элементы
let root = document.getElementById("root");
let container = document.querySelector(".container");
// элементы верхнего табло
let countTable = document.createElement("div");
let countGamer = document.createElement("div");
let countComp = document.createElement("div");
let countSteps = document.createElement("div");
countTable.classList.add("count-tables");
countGamer.classList.add("count-tables__table");
countComp.classList.add("count-tables__table");
countSteps.classList.add("count-tables__steps");
countTable.insertAdjacentElement("afterbegin", countComp);
countTable.insertAdjacentElement("afterbegin", countSteps);
countTable.insertAdjacentElement("afterbegin", countGamer);
container.insertAdjacentElement("afterbegin", countTable);

// элементы баннер
let bannerWhoWins = document.createElement("div");
bannerWhoWins.classList.add("banner-win");
bannerWhoWins.classList.add("hide");
container.insertAdjacentElement("beforeend", bannerWhoWins);

// форма и элементы
// форма
let formStartAndOptions = document.createElement("div");
formStartAndOptions.classList.add("form-start-options");
formStartAndOptions.setAttribute('name', 'formStart');
formStartAndOptions.classList.add("hide");
container.insertAdjacentElement("afterbegin", formStartAndOptions);

// кнопки
let buttonStartJunior = document.createElement("button");
buttonStartJunior.classList.add("button-start");
buttonStartJunior.setAttribute('data-level', 'jun');
buttonStartJunior.textContent = "START LEVEL JUNIOR";
formStartAndOptions.insertAdjacentElement("beforeend", buttonStartJunior);

let buttonStartMidl = document.createElement("button");
buttonStartMidl.classList.add("button-start");
buttonStartMidl.setAttribute('data-level', 'midl');
buttonStartMidl.textContent = "START LEVEL MIDL";
formStartAndOptions.insertAdjacentElement("beforeend", buttonStartMidl);

let buttonStartSenior = document.createElement("button");
buttonStartSenior.classList.add("button-start");
buttonStartSenior.setAttribute('data-level', 'senior');
buttonStartSenior.textContent = "START LEVEL SENIOR";
formStartAndOptions.insertAdjacentElement("beforeend", buttonStartSenior);

// фон
let fonDark = document.createElement("div");
fonDark.classList.add("fon-dark");
fonDark.classList.add("hide");
container.insertAdjacentElement("afterbegin", fonDark);

// функция генерации случайного числа
let getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// класс GameElement ------------------------------------------
class GameElement {
    constructor(typeOfElement) {
        this._typeOfElement = typeOfElement;
    }
    insertNewElement(intoParent, dataAttr, dataAttrVolume, className) {
        let e = document.createElement(this._typeOfElement);
        e.setAttribute(`${dataAttr}`, dataAttrVolume);
        intoParent.insertAdjacentElement("beforeend", e);
        e.classList.add(className);
        this.e = e;
    }
    setSize(width, height) {
        this.e.style.width = `${width}px`;
        this.e.style.height = `${height}px`;
    }
}
//-------------------------------------------------------------
// функция создает любое количество однотипных элементов, основанных на экземплярах
// класса GameElement, и устанавливает Родителя, Атрибут, Значение атрибута, Размер и Цвет.
function createCollectionOfElements(
    elem,
    parent,
    dataAttr,
    elemntCount,
    className,
    size
) {
    for (let i = 1; i <= elemntCount; i++) {
        elem.insertNewElement(parent, dataAttr, i, className);
        elem.setSize(size, size);
    }
}

//создаем экземпляры класса
let gameTable = new GameElement("table");
let gameTr = new GameElement("tr");
let gameTd = new GameElement("td");
//создаем из экземпляра элемент Table
createCollectionOfElements(
    gameTable,
    container,
    "data-gamefield",
    1,
    "gamefield"
);
gameTable = document.querySelector("[data-gamefield]");
//создаем из экземпляра элементы Tr
createCollectionOfElements(
    gameTr,
    gameTable,
    "data-gametr",
    FIELD_CELLS_COUNT,
    "game-tr"
);
let trArr = document.querySelectorAll("[data-gametr]");
//создаем из экземпляра элементы Td
trArr.forEach((elem) => {
    createCollectionOfElements(
        gameTd,
        elem,
        "data-gametd",
        FIELD_CELLS_COUNT,
        "color-base",
        CELL_SIZE
    );
});
let tdArr = document.querySelectorAll("[data-gametd]");

///////////////////////////////////////////////////////////////////////////
//////////////     И Г Р О В А Я    Л О Г И К А    ////////////////////////
///////////////////////////////////////////////////////////////////////////
const gameCount = {
    gamerCout: 0,
    compCount: 0,
    summCatchedCell: [],
};
countGamer.innerHTML = `<span>YOUR SCORES: ${gameCount.gamerCout}</span>`;
countComp.innerHTML = `<span>COMP SCORES: ${gameCount.compCount}</span>`;
countSteps.innerHTML = `<span>STEPS: ${gameCount.summCatchedCell.length}</span>`;

bannerWhoWins.classList.add("hide");

let isStartOptionsOnse = true; // отсекает попытку повторного запуска функции startOptions. КОСТЫЛЬ((
let levelMseconds = 1000;
let i = 0; // сброс счетчика ходов
let firstStart = true;

// проверяем на самый первый запуск
function isFirstStart() {
    if (firstStart) {
        startOptions();
        firstStart = false;
    }
}
isFirstStart(); //входная точка программы

// СТАРТ 
function startGame() {
    // запускаем таймер, и играем пока количество ходов меньше половины количества игровых клеток
    let timerOneStep = setInterval(() => {
        if (i < FIELD_CELLS_COUNT * FIELD_CELLS_COUNT / 2) {
            i++;
            switchElementColor();
        } else {
            clearInterval(timerOneStep);
            isStartOptionsOnse = true;
            whoWonBanner();
        }
    }, levelMseconds + 120);
}

// функция показывает окно выбора уровня игры, вызывает функцию очистки поля, и запускает игру
// с выбранным уровнем сложности
function startOptions() {
    formStartAndOptions.classList.remove("hide");
    fonDark.classList.remove("hide");
    formStartAndOptions.addEventListener("click", (event) => {
        if (isStartOptionsOnse) {
            if (event.target.dataset.level === "jun") {
                levelMseconds = 1500;
                startAfterSelectLevel();
            } else if (event.target.dataset.level === "midl") {
                levelMseconds = 1000;
                startAfterSelectLevel();
            } else if (event.target.dataset.level === "senior") {
                levelMseconds = 500;
                startAfterSelectLevel();
            }
        }
        isStartOptionsOnse = false;

        function startAfterSelectLevel() {
            clearField(); // очищаем поле и "срасываем" счет игры
            formStartAndOptions.classList.add("hide"); // прячем окно выбора и фон
            fonDark.classList.add("hide");
            i = 0; // сброс счетчика ходов
            startGame();
        }
    });
}

// функция очистки игрового поля
function clearField() {
    // очистка объекта Игрового счета
    gameCount.gamerCout = 0;
    gameCount.compCount = 0;
    gameCount.summCatchedCell = [];
    // очистка клеточек игрового поля
    tdArr.forEach((elem) => {
        elem.classList.remove("color-win");
        elem.classList.remove("color-fail");
        elem.classList.remove("color-try-catch");
    })
}

// функция "находит" случайную ячейку, переключает цвет (поймай меня),
// и проверяет, успел ли кликнуть игрок
function switchElementColor() {
    let curentCell = getRandomCell();

    function listenCurCell() {
        curentCell.curentCell.classList.add("color-win");
    }

    curentCell.curentCell.classList.add("color-try-catch");

    curentCell.curentCell.addEventListener("click", listenCurCell);
    setTimeout(() => {
        if (!curentCell.curentCell.classList.contains("color-win")) {
            curentCell.curentCell.classList.add("color-fail");
            gameCount.compCount++;
        } else {
            gameCount.gamerCout++;
        }
        countGamer.innerHTML = `<span>YOUR SCORES: ${gameCount.gamerCout}</span>`;
        countComp.innerHTML = `<span>COMP SCORES: ${gameCount.compCount}</span>`;
        countSteps.innerHTML = `<span>STEPS: ${gameCount.summCatchedCell.length}</span>`;

        curentCell.curentCell.removeEventListener("click", listenCurCell);
    }, levelMseconds);
};

// функция возвращает случайный элемент - ячейку
let getRandomCell = () => {
    let row, cell, rowCell;
    do {
        row = getRandomNumber(0, FIELD_CELLS_COUNT - 1);
        cell = getRandomNumber(0, FIELD_CELLS_COUNT - 1);
        rowCell = `${row}${cell}`;
    } while (gameCount.summCatchedCell.includes(rowCell));

    gameCount.summCatchedCell.push(rowCell);
    let curentCell = trArr[row].children[cell];

    return { curentCell: curentCell, rowCell: rowCell };
};

// фуекция показывает баннер "КТО ПОБЕДИТЕЛЬ"
function whoWonBanner() {
    bannerWhoWins.classList.remove("hide");
    if (gameCount.gamerCout > gameCount.compCount) {
        bannerWhoWins.style.color = "#0A0";
        bannerWhoWins.innerText = "YOU ARE WINNER";
    } else {
        bannerWhoWins.style.color = "#F00";
        bannerWhoWins.innerText = "YOU ARE LOOSER";
    }

    bannerWhoWins.addEventListener("click", (event) => {
        event.target.classList.add("hide");
        startOptions();
    })
}