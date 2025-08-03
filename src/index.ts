#!/usr/bin/env node

import { Command } from 'commander';
import { nasInfoCommand } from './commands/nas-info';
import { addDownloadTaskCommand } from './commands/add-download-task';
import { listDownloadTasksCommand } from './commands/list-download-tasks';
import { rebootCommand } from './commands/reboot';
const program = new Command();

program
  .name('synology-mcp')
  .description('CLI to manage a Synology NAS')
  .version('1.0.0');

program.addCommand(nasInfoCommand());
program.addCommand(addDownloadTaskCommand());
program.addCommand(listDownloadTasksCommand());
program.addCommand(rebootCommand());

program.parse(process.argv);