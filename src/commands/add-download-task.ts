import { Command } from 'commander';
import inquirer from 'inquirer';
import { SynologyClient } from '../lib/synology-client';

export function addDownloadTaskCommand() {
  const command = new Command('add-download-task');

  command
    .description('Add a download task to Download Station')
    .action(async () => {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'ip',
          message: 'Enter the NAS IP address:',
        },
        {
          type: 'input',
          name: 'uri',
          message: 'Enter the download URI (e.g., http, ftp, magnet):',
        },
        {
          type: 'input',
          name: 'username',
          message: 'Enter your NAS username:',
        },
        {
          type: 'password',
          name: 'password',
          message: 'Enter your NAS password:',
        },
      ]);

      const client = new SynologyClient(`http://${answers.ip}:5000`);

      try {
        await client.login(answers.username, answers.password);
        await client.addTask(answers.uri);
        console.log('Download task added successfully.');
      } catch (error) {
        if (error instanceof Error) {
          console.error('An error occurred:', error.message);
        } else {
          console.error('An unknown error occurred');
        }
      } finally {
        await client.logout();
      }
    });

  return command;
}