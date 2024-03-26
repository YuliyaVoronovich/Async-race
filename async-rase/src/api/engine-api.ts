import type { IDriveStatus, IEngine } from '../app/interfaces/engine';
import { baseUrl } from '../app/constants';

const ENGINE_URL = `${baseUrl}/engine`;

export async function chooseEngine(id: number, status: string): Promise<IEngine> {
  const response = await fetch(`${ENGINE_URL}?id=${id}&status=${status}`, {
    method: 'PATCH',
  });
  return response.json() as Promise<IEngine>;
}

export async function startDrive(id: number): Promise<IDriveStatus> {
  try {
    const response = await fetch(`${ENGINE_URL}?id=${id}&status=drive`, {
      method: 'PATCH',
    });
    return await (response.json() as Promise<IDriveStatus>);
  } catch (error) {
    return { success: false };
  }
}
