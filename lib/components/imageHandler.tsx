export const encodeImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 48;
                canvas.height = 48;
                const ctx = canvas.getContext('2d');

                if (ctx) {
                    ctx.drawImage(img, 0, 0, 48, 48);
                    const resizedBase64 = canvas.toDataURL('image/png');
                    resolve(resizedBase64);
                } else {
                    reject(new Error('Failed to get canvas context'));
                }
            };

            if (e.target?.result) {
                img.src = e.target.result as string;
            }
        };

        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

export const decodeBase64ToImage = (base64: string): string => {
    return base64;
};
