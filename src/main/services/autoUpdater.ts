import {autoUpdater} from 'electron-updater';
import {dialog} from 'electron';
import log from 'electron-log/main';

autoUpdater.logger = log;
autoUpdater.autoDownload = false;

export function initializeAutoUpdater() {
    autoUpdater.logger = log;

    autoUpdater.on('checking-for-update', () => {
        log.info('Checking for updates...');
    });

    autoUpdater.on('update-available', async () => {
        log.info('Update available.');

        const downloadNow = await dialog.showMessageBox({
            type: 'question',
            title: 'Update Available',
            message: 'A new version of the app is available. Download now?',
            buttons: ['Yes', 'No'],
        });

        if (downloadNow.response === 0) {
            log.info('Downloading...');
            await autoUpdater.downloadUpdate();
        } else {
            log.info('Update declined.');
        }
    });

    autoUpdater.on('update-not-available', () => {
        log.info('No updates available.');
    });

    autoUpdater.on('error', (err) => {
        log.error('Error in auto-updater.', err);
    });

    autoUpdater.on('update-downloaded', async () => {
        log.info('Update downloaded.');

        const restartNow = await dialog.showMessageBox({
            type: 'question',
            title: 'Install Update',
            message: 'Update downloaded. Restart now?',
            buttons: ['Yes', 'Later'],
        });

        if (restartNow.response === 0) {
            log.info('Restarting...');
            autoUpdater.quitAndInstall();
        }
    });
}

export async function checkForUpdates() {
    try {
        await autoUpdater.checkForUpdates();
    } catch (error) {
        log.error('Failed to check for updates:', error);
    }
}
