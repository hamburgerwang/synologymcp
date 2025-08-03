import { Command } from 'commander';
import inquirer from 'inquirer';
import { SynologyClient } from '../lib/synology-client';

export function nasInfoCommand() {
  const command = new Command('nas-info');

  command
    .description('Get information about the NAS')
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
      ]);

      const client = new SynologyClient(`http://${answers.ip}:5000`);

      try {
        await client.login(answers.username, answers.password);
        const nasInfo = await client.getNasInfo();

        console.log('NAS Information:');
        console.log(`  Model: ${nasInfo.model}`);
        console.log(`  Firmware Version: ${nasInfo.firmware_ver}`);
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