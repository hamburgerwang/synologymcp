import { Command } from 'commander';
import inquirer from 'inquirer';
import { SynologyClient } from '../lib/synology-client';

export function rebootCommand() {
  const command = new Command('reboot');

  command
    .description('Reboot the NAS')
    .action(async () => {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'ip',
          message: 'Enter the NAS IP address:',
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
        {
          type: 'confirm',
          name: 'confirm',
          message: 'Are you sure you want to reboot the NAS?',
          default: false,
        },
      ]);

      if (!answers.confirm) {
        console.log('Reboot cancelled.');
        return;
      }

      const client = new SynologyClient(`http://${answers.ip}:5000`);

      try {
        await client.login(answers.username, answers.password);
        await client.reboot();
        console.log('NAS is rebooting...');
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