const electron = require('electron');
const app = electron.app;  // Модуль контролирующей жизненный цикл нашего приложения.
const BrowserWindow = electron.BrowserWindow;  // Модуль создающий браузерное окно.
const path = require('path');

// Опционально возможность отправки отчета о ошибках на сервер проекта Electron.

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
    mainWindow.loadURL('file://' + __dirname + '/public/index.html');

    // Открываем DevTools.
    // mainWindow.webContents.openDevTools();
    
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