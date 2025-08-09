
import { apiCall, API_BASE_URL } from './database';

/**
 * Upload a file to the backend storage
 * @param file File to upload
 * @param path Optional path prefix
 * @returns URL of the uploaded file
 */
export const uploadFile = async (file: File, path?: string): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (path) {
      formData.append('path', path);
    }
    
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Errore durante il caricamento del file:', error);
    throw error;
  }
};

/**
 * Delete a file from storage
 * @param url URL of the file to delete
 */
export const deleteFile = async (url: string): Promise<void> => {
  try {
    await apiCall('/upload/delete', {
      method: 'DELETE',
      body: JSON.stringify({ url }),
    });
  } catch (error) {
    console.error('Errore durante la cancellazione del file:', error);
    throw error;
  }
};
