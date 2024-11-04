export const fetchImageUrl = async (
    url: string,              
    setImageUrl: (url: string) => void,  
    setIsLoadingImage: (isLoading: boolean) => void
) => {
    try {
        setIsLoadingImage(true);
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.text();
            setImageUrl(data);
        } else {
            console.error('Error al cargar la imagen:', response.status);
        }
    } catch (error) {
        console.error('Error al cargar la imagen:', error);
    } finally {
        setIsLoadingImage(false);
    }
};
