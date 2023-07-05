const { app, BrowserWindow, Tray, Menu,nativeImage  } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
/*if (require('electron-squirrel-startup')) {
  app.quit();
}*/
const image = nativeImage.createFromPath('src/assets/favicon.ico')
console.log(image)
debugger
console.log("path="+path)
console.log("dir="+__dirname)
console.log("file="+__filename)
console.log("env="+process.env)
let mainWindow
let tray = null  // 在外面创建tray变量，防止被自动删除，导致图标自动消失
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    // show: true,
    autoHideMenuBar: true,
    // icon: path.join("src\\assets", 'favicon.ico'),...(process.platform === 'linux' ? { icon } : {}),
    icon: image,
    webPreferences: {
      webSecurity: false, //禁用窗口同源策略,允许加载本地文件
      // preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  // mainWindow.loadURL(MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY);
   mainWindow.loadURL("http://192.168.109.172:3000/");
  // mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // 当点击关闭按钮
  mainWindow.on('close', (e) => {
    e.preventDefault();  // 阻止退出程序
    mainWindow.setSkipTaskbar(true)   // 取消任务栏显示
    mainWindow.hide();    // 隐藏主程序窗口
  })

  // 创建任务栏图标 path.join('src/assets', 'favicon.ico')
  tray = new Tray(image)

  // 自定义托盘图标的内容菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      // 点击退出菜单退出程序
      label: '退出', click: function () {
        mainWindow.destroy()
        app.quit()

      }
    }
  ])

  tray.setToolTip('MSS智慧客服')  // 设置鼠标指针在托盘图标上悬停时显示的文本
  tray.setContextMenu(contextMenu)  // 设置图标的内容菜单
  // 点击托盘图标，显示主窗口
  tray.on("click", () => {
    mainWindow.show();
    mainWindow.setSkipTaskbar(true)
  })
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 隐藏主窗口
app.on('windowHide', function() {
  mainWindow.hide()
  mainWindow.setSkipTaskbar(false)
})
