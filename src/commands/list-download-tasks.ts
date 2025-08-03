import { Command } from 'commander';
import inquirer from 'inquirer';
import { SynologyClient } from '../lib/synology-client';

export function listDownloadTasksCommand() {
  const command = new Command('list-download-tasks');

  command
    .description('List download tasks from Download Station')
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
        const tasks = await client.listTasks();

        console.log('Download Tasks:');
        tasks.forEach((task) => {
          console.log(`  - ${task.title} (${task.status})`);
        });
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