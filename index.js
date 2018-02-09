const {app, BrowserWindow, ipcMai} = require('electron');
const path = require('path'),
      adBlock = require('./scripts/adblock.js');

global.adBlock = adBlock;

// Определение глобальной ссылки , если мы не определим, окно
// окно будет закрыто автоматически когда JavaScript объект будет очищен сборщиком мусора.
var mainWindow = null;

// Проверяем что все окна закрыты и закрываем приложение.
app.on('window-all-closed', function() {
  // В OS X обычное поведение приложений и их menu bar
  //  оставаться активными до тех пор пока пользователь закроет их явно комбинацией клавиш Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// Этот метод будет вызван когда Electron закончит инициализацию 
// и будет готов к созданию браузерных окон.
app.on('ready', function () {
    const fs = require('fs'),
          winConfigPath = path.join(app.getPath('userData'), 'config', 'window.json');
    
    // Создать папку config, если ее нет
    if (!fs.existsSync(path.join(app.getPath('userData'), 'config'))) {
        fs.mkdirSync(path.join(app.getPath('userData'), 'config'))
    }
    
    let windowDef = {
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        backgroundColor: '#32373B',
        maximized: true,
        icon: path.join(__dirname, 'icons/png/64x64.png')
    }
    
    var winConfig = {},
        configFile = {};
    
    try {
        configFile = JSON.parse(fs.readFileSync(winConfigPath, 'utf8'));
    } catch (e) {
        configFile.bounds = {};
    }
    Object.assign(winConfig, windowDef, configFile.bounds);
    winConfig.maximized = configFile.maximized
    
    // Создаем окно браузера.
    mainWindow = new BrowserWindow(winConfig);
    
    mainWindow.setMenu(null);
    
    if (winConfig.maximized) {
        mainWindow.maximize()
    }

    // и загружаем файл index.html нашего веб приложения.
    mainWindow.loadURL('file://' + __dirname + '/public/index.html', {
        extraHeaders: 'Referer:""'
    });

    // Открываем DevTools.
    //mainWindow.webContents.openDevTools();

    // Блокируем рекламу в iframe
    mainWindow.webContents.session.webRequest.onBeforeRequest(['*://*./*'], (details, callback) => {
        if (adBlock.isBlocked(details.url)) {
            mainWindow.webContents.send('adblock', details);
            callback({ cancel: true });
        } else {
            callback({ cancel: false });
        }
    })

    // Добавляем referer для сайта hdgo.cc
    mainWindow.webContents.session.webRequest.onBeforeSendHeaders(['*://hdgo.cc/*'], (details, callback) => {
        details.requestHeaders['Referer'] = 'google.com';
        callback({ cancel: false, requestHeaders: details.requestHeaders });
    })
    
    mainWindow.on('close', () => {
        let data = {
            bounds: mainWindow.getBounds(),
            maximized: mainWindow.isMaximized()
        };
        
        fs.writeFileSync(winConfigPath, JSON.stringify(data));
        console.log(mainWindow);
    })

    // Этот метод будет выполнен когда генерируется событие закрытия окна.
    mainWindow.on('closed', function () {
        // Удаляем ссылку на окно, если ваше приложение будет поддерживать несколько     
        // окон вы будете хранить их в массиве, это время 
        // когда нужно удалить соответствующий элемент.
        
        mainWindow = null;
    });
});