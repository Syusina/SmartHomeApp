const dom = {
  selectBox: document.getElementById('selectBox'),
  selectBoxList: document.querySelector('.selectBox__list'),
  rooms: document.getElementById('rooms'),
  settings: document.getElementById('settings'),
  settingsTabs: document.getElementById('settings__tabs'),
  settingsPanels: document.getElementById('settings__panel'),
  tempLine: document.getElementById('tempLine'),
  tempRound: document.getElementById('tempRound'),
  temperature: document.getElementById('temperature'),
  temperatureBtn: document.getElementById('temperature-btn'),
  saveBtn: document.getElementById('save-temperature'),
  powerBtn: document.getElementById('power'),
  sliders: {
    lights: document.getElementById('lighthSlider'),
    humidity: document.getElementById('humiditySlider'),
  },
  switch: {
    lights: document.getElementById('lights-power'),
    humidity: document.getElementById('humidity-power'),
  },
};

const rooms = {
  all: 'Все комнаты',
  livingroom: 'Зал',
  bedroom: 'Спальня',
  kitchen: 'Кухня',
  bathroom: 'Ванная',
  studio: 'Кабинет',
  washingroom: 'Уборная',
};

let activeRoom = 'all';
let activeTab = 'temperature';

const roomsData = {
  livingroom: {
    temperature: 23,
    temperatureOff: false,
    lights: 100,
    lightsOff: false,
    humidity: 70,
    humidityOff: false,
  },
  bedroom: {
    temperature: 23,
    temperatureOff: false,
    lights: 100,
    lightsOff: false,
    humidity: 70,
    humidityOff: false,
  },
  kitchen: {
    temperature: 23,
    temperatureOff: false,
    lights: 100,
    lightsOff: false,
    humidity: 70,
    humidityOff: false,
  },
  bathroom: {
    temperature: 23,
    temperatureOff: false,
    lights: 100,
    lightsOff: false,
    humidity: 70,
    humidityOff: false,
  },
  studio: {
    temperature: 23,
    temperatureOff: false,
    lights: 100,
    lightsOff: false,
    humidity: 70,
    humidityOff: false,
  },
  washingroom: {
    temperature: 23,
    temperatureOff: false,
    lights: 100,
    lightsOff: false,
    humidity: 70,
    humidityOff: false,
  },
};

// Выпадающий список
dom.selectBox.querySelector('.selectBox__selected').addEventListener('click', event => {
  dom.selectBox.classList.toggle('open');
});

document.body.addEventListener('click', event => {
  const { target } = event;
  if (!target.matches('.selectBox')
  && !target.parentElement.matches('.selectBox')
  && !target.parentElement.parentElement.matches('.selectBox')) {
    dom.selectBox.classList.remove('open');
  }
});

dom.selectBoxList.addEventListener('click', event => {
  const { target } = event;
  if (target.matches('.selectBoxItem')) {
    const { room } = target.dataset;
    const selectedItem = dom.selectBoxList.querySelector('.selected');
    selectedItem.classList.remove('selected');    
    target.classList.add('selected');
    dom.selectBox.classList.remove('open');
    selectRoom(room);
  }
});

// Выбор комнаты
function selectRoom(room) {
  const selectedRoom = dom.rooms.querySelector('.selected');
  if (selectedRoom) {
    selectedRoom.classList.remove('selected');
  }
  if (room !== 'all') {
    const newSelectedRoom = dom.rooms.querySelector(`[data-room=${room}]`);
    const { 
      temperature,
      lights,
      humidity,
      lightsOff, 
      humidityOff
    } = roomsData[room];
    activeRoom = room;
    newSelectedRoom.classList.add('selected');
    renderScreen(false);
    dom.temperature.innerText = temperature;
    renderTemperature(temperature);
    setTemperaturePower();
    changeSettingsType(activeTab);
    chandeSlider(lights, dom.sliders.lights);
    chandeSlider(humidity, dom.sliders.humidity);
    changeSwitch('lights', lightsOff);
    changeSwitch('humidity', humidityOff);
  } else {
    renderScreen(true);
  }
  const selectedBoxRoom = dom.selectBox.querySelector('.selectBoxItem.selected');
  selectedBoxRoom.classList.remove('selected');
  const newSelectedItem = dom.selectBox.querySelector(`[data-room=${room}]`);
  newSelectedItem.classList.add('selected');
  const selectBoxSelected = dom.selectBox.querySelector('.selectBox__selected span');
  selectBoxSelected.innerText = rooms[room];
};

// Клик по элементу комнаты
dom.rooms.querySelectorAll('.room').forEach((room) => {
  room.addEventListener('click', event => {
    const value = room.dataset.room;
    selectRoom(value);
  })
});

// Отображение выбранного экрана
function renderScreen(isRooms) {
  setTimeout(() => {
    if (isRooms) {
      dom.rooms.style.display = 'grid';
      dom.settings.style.display = 'none'
    } else {
      dom.settings.style.display = 'block'
      dom.rooms.style.display = 'none';
    }
  }, 300)
};

// Функция отрисовки температуры 
function renderTemperature(temperature) {
  const min = 16;
  const max = 40;
  const range = max - min;
  const persent = range / 100;
  
  const lineMin = 54;
  const lineMax = 276;
  const lineRange = lineMax - lineMin;
  const linePersent = lineRange / 100;
 
  const roundMin = -240;
  const roundMax = 48;
  const roundRange = roundMax - roundMin;
  const roundPersent = roundRange / 100; 

  if (temperature >= min && temperature <= max) {
    const finishPersentTemp = Math.round((temperature - min) / persent);
    const lineFinishtemp = lineMin + linePersent * finishPersentTemp;
    const roundFinishTemp = roundMin + roundPersent * finishPersentTemp;
    dom.tempLine.style.strokeDasharray = `${lineFinishtemp}, 276`;
    dom.tempRound.style.transform = `rotate(${roundFinishTemp}deg)`;
    dom.temperature.innerText = temperature;
  }
};

// Изменение температуры
function changeTemperature() {
  let mouseOver = false;
  let mouseDown = false;
  let position = 0;
  let range = 0;
  let change = 0;

  dom.temperatureBtn.onmouseover = () => {
    mouseOver = true;
    mouseDown = false;
  };
  dom.temperatureBtn.onmouseout = () => mouseOver = false;
  dom.temperatureBtn.onmouseup = () => mouseDown = false;
  dom.temperatureBtn.onmousedown = (e) => {
    mouseDown = true;
    position = e.offsetY;
    range = 0;
  };

  dom.temperatureBtn.onmousemove = (e) => {
    if (mouseOver && mouseDown) {
      range = e.offsetY - position;
      const newChange = Math.round(range / -5);
      if (newChange !== change) {
        let temperature = Number(dom.temperature.innerText);
        if (newChange < change) {
          temperature -= 1;
        } else {
          temperature += 1;
        }
        change = newChange;
        renderTemperature(temperature);
      }
    }
  };
};

changeTemperature();

// Функция установки температуры
dom.saveBtn.onclick = () => {
  const temperature = Number(dom.temperature.innerText);
  roomsData[activeRoom].temperature = temperature;
  alert('Температура сохранена');
};

// Функция отключения обогрева
dom.powerBtn.onclick = () => {
  const power = dom.powerBtn;
  power.classList.toggle('off');
  if (power.matches('.off')) {
    roomsData[activeRoom].temperatureOff = true;
  } else {
    roomsData[activeRoom].temperatureOff = false;
  };
};

// Установка значения кнопки включения температуры
function setTemperaturePower() {
  if (roomsData[activeRoom].temperatureOff) {
    dom.powerBtn.classList.add('off');
  } else {
    dom.powerBtn.classList.remove('off');
  }
};

// Переключение настроек
dom.settingsTabs.querySelectorAll('.tab').forEach((tab) => {
  tab.onclick = () => {
    const optionType = tab.dataset.type;
    activeTab = optionType;
    changeSettingsType(optionType);
  }
});

// Смена панели настроек
function changeSettingsType(type) {
  const tabSelected = dom.settingsTabs.querySelector('.tab.selected');
  const panelSelected = dom.settingsPanels.querySelector('.selected');
  const tab = dom.settingsTabs.querySelector(`[data-type=${type}]`);
  const panel = dom.settingsPanels.querySelector(`[data-type=${type}]`);

  tabSelected.classList.remove('selected');
  panelSelected.classList.remove('selected');
  tab.classList.add('selected');
  panel.classList.add('selected');
};

// Изменения слайдера
function chandeSlider(persent, slider) {
  if (persent >= 0 && persent <= 100 ) {
    const { type } = slider.parentElement.parentElement.dataset;
    slider.querySelector('span').innerText = persent;
    slider.style.height = `${persent}%`;
    roomsData[activeRoom][type] = persent;  
  }
};

// Отслеживание изменений слайдера
function watchSlider(slider) {
  let mouseOver = false;
  let mouseDown = false;
  let position = 0;
  let range = 0;
  let change = 0;
  const parent = slider.parentElement;

  parent.onmouseover = () => {
    mouseOver = true;
    mouseDown = false;
  }
  parent.onmouseout = () => mouseOver = false;
  parent.onmouseup = () => mouseDown = false;
  parent.onmousedown = (e) => {
    mouseDown = true;
    position = e.offsetY;
    range = 0;

    parent.onmousemove = (e) => {
      if (mouseOver && mouseDown) {
        range = e.offsetY - position;
        const newChange = Math.round(range / -0.1);
        if (newChange !== change) {
          let persent = Number(slider.querySelector('span').innerText);
          if (newChange < change) {
            persent -= 1;
          } else {
            persent += 1;
          }
          change = newChange;
          chandeSlider(persent, slider);
        }
      }
    };
  };
};

watchSlider(dom.sliders.lights);
watchSlider(dom.sliders.humidity);

// Выключатель влажности или света
function changeSwitch(activeTab, isOff) {
  if (isOff) {
    dom.switch[activeTab].classList.add('off');
  } else {
    dom.switch[activeTab].classList.remove('off');
  }
  roomsData[activeRoom][`${activeTab}Off`] = isOff;
};

dom.switch.humidity.onclick = () => {
  const isOff = !dom.switch.humidity.matches('.off');
  changeSwitch(activeTab, isOff);
};

dom.switch.lights.onclick = () => {
  const isOff = !dom.switch.lights.matches('.off');
  changeSwitch(activeTab, isOff);
};



