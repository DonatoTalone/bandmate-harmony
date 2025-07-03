
import { supabase } from './client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Carica un file nello storage di Supabase
 * @param bucket Nome del bucket
 * @param file File da caricare
 * @param path Percorso opzionale
 * @returns URL del file caricato
 */
export const uploadFile = async (bucket: string, file: File, path?: string): Promise<string> => {
  try {
    // Crea un nome file unico
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;
    
    // Carica il file
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (uploadError) throw uploadError;
    
    // Ottieni l'URL pubblico del file
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  } catch (error) {
    console.error('Errore durante il caricamento del file:', error);
    throw error;
  }
};

/**
 * Crea il bucket se non esiste
 * @param bucketName Nome del bucket
 */
export const createBucketIfNotExists = async (bucketName: string): Promise<void> => {
  try {
    // Verifica se il bucket esiste
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    // Se non esiste, crealo
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: true
      });
      
      if (error) throw error;
    }
  } catch (error) {
    console.error('Errore durante la verifica/creazione del bucket:', error);
    throw error;
  }
};
