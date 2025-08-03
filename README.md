# Synology MCP (Management CLI for Synology NAS)

This command-line interface (CLI) was generated with Gemini CLI.

This CLI is built with TypeScript to help manage your Synology NAS server. It provides tools for common tasks such as adding download tasks, getting NAS information, listing download tasks, and rebooting the NAS.

## Features

- Get basic NAS information (model, firmware version)
- Add download tasks to Download Station
- List current download tasks
- Reboot the NAS

## Installation

To set up the project, clone the repository and install the dependencies:

```bash
git clone https://github.com/YOUR_USERNAME/synologymcp.git
cd synologymcp
npm install
```

## Usage

All commands are run using `npx ts-node src/index.ts <command>`. You will be prompted for your NAS IP address, username, and password for authentication.

### Get NAS Information

To retrieve basic information about your Synology NAS:

```bash
npx ts-node src/index.ts nas-info
```

### Add Download Task

To add a new download task to Download Station:

```bash
npx ts-node src/index.ts add-download-task
```

You will be prompted to enter the download URI (e.g., HTTP, FTP, magnet link).

### List Download Tasks

To view a list of current downloading and downloaded tasks:

```bash
npx ts-node src/index.ts list-download-tasks
```

### Reboot NAS

To reboot your Synology NAS:

```bash
npx ts-node src/index.ts reboot
```

**Warning:** This command will prompt for confirmation before rebooting your NAS. Use with caution.
