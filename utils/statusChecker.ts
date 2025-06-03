import { ShortcutStatus } from '@/types';

// Check website status to determine if it's accessible and has a next page
export const checkWebsiteStatus = async (url: string): Promise<ShortcutStatus> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Mozilla/5.0 (compatible; MangaReaderApp/1.0)'
      },
    });

    if (!response.ok) {
      return {
        lastChecked: new Date().toISOString(),
        hasNextPage: false,
        hasError: true,
      };
    }

    const html = await response.text();
    
    // Check if there might be a next page by looking for common navigation elements
    // This is a simplified approach and may need refinement for specific sites
    const hasNextPage = html.includes('next chapter') || 
                       html.includes('next page') || 
                       html.includes('chapter-next') ||
                       html.includes('pagination') ||
                       html.includes('next_chapter');

    return {
      lastChecked: new Date().toISOString(),
      hasNextPage,
      hasError: false,
    };
  } catch (error) {
    console.error('Error checking website status:', error);
    
    return {
      lastChecked: new Date().toISOString(),
      hasNextPage: false,
      hasError: true,
    };
  }
};