import {app, BrowserWindow, globalShortcut, Menu, shell} from 'electron';
import {initializeIpcHandlers} from './ipc/ipcHandlers';
import * as dotenv from 'dotenv';
import {join, resolve} from 'path';
import {format} from 'url';
import {checkForUpdates, initializeAutoUpdater} from './services/autoUpdater';

dotenv.config();

const isDev = process.env.NODE_ENV === 'development';
const isDebug = process.env.NODE_ENV === 'debug';
let mainWindow: BrowserWindow | null = null;

async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 500,
        webPreferences: {
            preload: resolve(__dirname, 'preload.js'),
            nodeIntegration: false,     // Disables Node.js in the renderer process for security (Security)
            contextIsolation: true,     // Separates Electron’s API from the renderer JavaScript (Security)
            sandbox: true,              // Isolates processes for extra security (Security)
        },
    });

    mainWindow.maximize();

    // Context Menu (Right Click)
    mainWindow.webContents.on('context-menu', () => {
        const contextMenu = Menu.buildFromTemplate([
            {role: 'undo', label: 'Undo'},
            {role: 'redo', label: 'Redo'},
            {type: 'separator'},
            {role: 'reload', label: 'Reload'},
            {type: 'separator'},
            {role: 'cut', label: 'Cut'},
            {role: 'copy', label: 'Copy'},
            {role: 'paste', label: 'Paste'},
            {role: 'selectAll', label: 'Select All'},
        ]);
        contextMenu.popup({window: mainWindow!});
    });

    if (isDev || isDebug) {
        await mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    } else {
        // Hide the default menu bar in production
        Menu.setApplicationMenu(null);
        await mainWindow.loadURL(
            format({
                pathname: join(__dirname, '../renderer/index.html'),
                protocol: 'file:',
                slashes: true,
            }),
        );
    }

    // Allow console opening even in production
    globalShortcut.register('Ctrl+Shift+I', () => {
        if (mainWindow) {
            mainWindow.webContents.toggleDevTools();
        }
    });

    // Open external links in the default system browser/app
    mainWindow.webContents.setWindowOpenHandler(({url}) => {
        shell.openExternal(url);
        return {action: 'deny'};
    });

    // Stops Electron Window from navigating to an external URL
    mainWindow.webContents.on('will-navigate', async (event, url) => {
        const currentUrl = mainWindow.webContents.getURL();
        if (url !== currentUrl) {
            event.preventDefault();
            await shell.openExternal(url);
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(async () => {
    initializeAppEvents();
    initializeIpcHandlers();
    initializeAutoUpdater();
    await checkForUpdates();
    await createWindow();
});

function isMac(): boolean {
    // TODO: Deprecated, but the official documentation does not mention it
    return process.platform === 'darwin';
}

function initializeAppEvents() {
    app.on('activate', async () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            await createWindow();
        }
    });

    app.on('window-all-closed', () => {
        if (!isMac()) {
            app.quit();
        }
    });

    app.on('activate', async () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            await createWindow();
        }
    });
}

export {mainWindow};
