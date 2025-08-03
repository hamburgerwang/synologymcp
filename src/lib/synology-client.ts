import axios from 'axios';

interface ApiResponse<T> {
  data: T;
  success: boolean;
}

interface LoginData {
  sid: string;
}

interface NasInfoData {
  model: string;
  firmware_ver: string;
}

interface Task {
  id: string;
  title: string;
  status: string;
}

interface ListTasksData {
  tasks: Task[];
}

export class SynologyClient {
  private readonly baseUrl: string;
  private sid?: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async login(username: string, password: string): Promise<void> {
    const url = `${this.baseUrl}/webapi/auth.cgi?api=SYNO.API.Auth&version=3&method=login&account=${username}&passwd=${password}&session=FileStation&format=sid`;
    const response = await axios.get<ApiResponse<LoginData>>(url);

    if (response.data.success) {
      this.sid = response.data.data.sid;
    } else {
      throw new Error('Login failed');
    }
  }

  async getNasInfo(): Promise<NasInfoData> {
    if (!this.sid) {
      throw new Error('Not logged in');
    }

    const url = `${this.baseUrl}/webapi/entry.cgi?api=SYNO.Core.System&version=1&method=info&_sid=${this.sid}`;
    const response = await axios.get<ApiResponse<NasInfoData>>(url);

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error('Failed to get NAS info');
    }
  }

  async addTask(uri: string): Promise<void> {
    if (!this.sid) {
      throw new Error('Not logged in');
    }

    const url = `${this.baseUrl}/webapi/DownloadStation/task.cgi`;
    const response = await axios.post(
      url,
      `api=SYNO.DownloadStation.Task&version=1&method=create&uri=${uri}&_sid=${this.sid}`
    );

    if (!response.data.success) {
      throw new Error('Failed to add download task');
    }
  }

  async listTasks(): Promise<Task[]> {
    if (!this.sid) {
      throw new Error('Not logged in');
    }

    const url = `${this.baseUrl}/webapi/DownloadStation/task.cgi?api=SYNO.DownloadStation.Task&version=1&method=list&_sid=${this.sid}`;
    const response = await axios.get<ApiResponse<ListTasksData>>(url);

    if (response.data.success) {
      return response.data.data.tasks;
    } else {
      throw new Error('Failed to list download tasks');
    }
  }

  async reboot(): Promise<void> {
    if (!this.sid) {
      throw new Error('Not logged in');
    }

    const url = `${this.baseUrl}/webapi/entry.cgi?api=SYNO.Core.System&version=1&method=reboot&_sid=${this.sid}`;
    const response = await axios.get(url);

    if (!response.data.success) {
      throw new Error('Failed to reboot NAS');
    }
  }

  async logout(): Promise<void> {
    if (!this.sid) {
      return;
    }

    const url = `${this.baseUrl}/webapi/auth.cgi?api=SYNO.API.Auth&version=1&method=logout&session=FileStation&_sid=${this.sid}`;
    await axios.get(url);
    this.sid = undefined;
  }
}