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
  console.log(2);
  try {
    const response = await fetch(`${ENGINE_URL}?id=${id}&status=drive`, {
      method: 'PATCH',
    });
    return await (response.json() as Promise<IDriveStatus>);
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}

// export async function startEngine(id: number): Promise<IEngine> {
//   const response = await fetch(`${ENGINE_URL}?id=${id}&status=${EngineStatus.started}`, {
//     method: 'PATCH',
//   });
//   return response.json() as Promise<IEngine>;
// }

// export async function stopEngine(id: number): Promise<IEngine> {
//   const response = await fetch(`${ENGINE_URL}?id=${id}&status=${EngineStatus.stopped}`, {
//     method: 'PATCH',
//   });
//   return response.json() as Promise<IEngine>;
// }
